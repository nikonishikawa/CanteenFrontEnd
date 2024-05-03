import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerDto, TrayItemsDTO } from '../../../models/tray.model';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Customer } from '../../../models/user.model';
import { orderItems, orders } from '../../../models/orders.model';
import { constants } from 'buffer';
import { Menu } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})

export class OrderComponent {
  customer: Customer = {} as Customer;
  tray: TrayItemsDTO = {} as TrayItemsDTO;
  orderItems: orderItems[] =  [];
  order: orders = {} as orders;
  menus: Menu[] = [];
  orderItemsMap: { [orderId: number]: orderItems[] } = {};
  // orderGroups: { orderId: number; modeOfPayment: string; status: string; orderStamp: string; cost:number; orderItems: orderItems[] }[] = [];
  orderGroups: any[] = [];
  openOrderItem: any = null;
  showFirstContent: boolean = false;
 

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private menuService: MenuService,
    private customerService: CustomerService,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadCustomerData();
  
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        this.customer.customerId = res.data.customerId;
        console.log('Received customer data:', res.data.customerId);
        this.getOrders()
      }
    });
  }
  
  getOrders() {
    if (!this.customer.customerId) {
      console.error('Customer ID not found');
      return;
    }
  
    this.orderService.getOrders(this.customer.customerId).subscribe({
      next: (res: { isSuccess: boolean, data: orderItems[], message: string }) => {
        if (res.isSuccess) {  
          this.orderItems = res.data;
          console.log("Response", res);
          this.loadItem();
          if (this.orderItems && this.orderItems.length > 0) {
            this.preprocessOrderItems(this.orderItems); 
          } else {
            console.error("Order items array is empty or undefined");
          }
        } else {
          console.error('Error retrieving orders:', res.message);
        }
      },
      error: (err) => {
        console.error('Error retrieving orders:', err);
      }
    });
  }
  
  openModal(orderId: any) {
    this.openOrderItem = this.openOrderItem === orderId ? null : orderId;
  }
  
  getAllMenus() {
    this.menuService.getAllMenu().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.menus = res.data;
          console.log("Response", res);

          if (this.menus && this.menus.length > 0) {
            this.menus.forEach(menuItem => {
              if (menuItem && menuItem) {
                console.log("Item ID:", menuItem.itemId);
                console.log("Item:", menuItem.item);
                console.log("Description:", menuItem.description);
                console.log("Is Halal:", menuItem.isHalal);
                console.log("Price:", menuItem.price);
                console.log("Category:", menuItem.category);
              } else {
                console.error("Menu item or its data is undefined:", menuItem);
              }
            });
          } else {
            console.error("Menus array is empty or undefined");
          }
        } else {
          console.error('Error retrieving menus:', res.message);
        }
      }
    );
  }

  
  loadItem(index: number = 0) {
    if (index >= this.orderItems.length) {
      console.log('All items loaded successfully.');
      return;
    }
  
    const orderItem = this.orderItems[index];
    const itemId = orderItem.item;
  
    this.orderService.getItemById(itemId).subscribe({
      next: (res) => {
        const fetchedItem = res.data;
        if (fetchedItem.itemId === orderItem.orderItemId) {
          orderItem.item = fetchedItem.item;
          orderItem.foodImage = fetchedItem.foodImage;
          console.log('Received item:', orderItem.item);
          console.log('Received food image:', orderItem.foodImage);
        }
        // Move to the next item
        this.loadItem(index + 1);
      },
      error: (error) => {
        console.error('Error loading item:', error);
        // Move to the next item even if there's an error
        this.loadItem(index + 1);
      }
    });
  }
  
  
  getMenuName(item: any) {
    return item.name; 
  }

  preprocessOrderItems(orderItems: orderItems[]): void {
    const orderGroupsMap: { [orderId: number]: orderItems[] } = {};
    orderItems.forEach(orderItem => {
      const orderId = orderItem.orderId;
      if (!orderGroupsMap[orderId]) {
        orderGroupsMap[orderId] = [];
      }
      orderGroupsMap[orderId].push(orderItem);
    });
  
    this.orderGroups = Object.keys(orderGroupsMap).map(orderId => ({
      orderId: Number(orderId),
      modeOfPayment: this.getUniqueModeOfPayment(orderGroupsMap[Number(orderId)]),
      status: this.getUniqueStatus(orderGroupsMap[Number(orderId)]),
      orderStamp: this.getUniqueOrderStamp(orderGroupsMap[Number(orderId)]),
      cost: this.getUniqueCost(orderGroupsMap[Number(orderId)]),
      orderItems: orderGroupsMap[Number(orderId)]
    }));
  }
  
  getUniqueModeOfPayment(orderItems: orderItems[]): string {
    const uniqueModeOfPayments = Array.from(new Set(orderItems.map(item => item.modeOfPayment)));
    return uniqueModeOfPayments.length === 1 ? uniqueModeOfPayments[0] : 'Multiple';
  }
  
  getUniqueStatus(orderItems: orderItems[]): string {
    const uniqueStatuses = Array.from(new Set(orderItems.map(item => item.status)));
    return uniqueStatuses.length === 1 ? uniqueStatuses[0] : 'Multiple';
  }

  getUniqueOrderStamp (orderItems: orderItems[]): string {
    const uniqueorderStamp = Array.from(new Set(orderItems.map(item => item.orderStamp)));
    return uniqueorderStamp.length === 1? uniqueorderStamp[0] : 'Multiple';
  }

  getUniqueCost(orderItems: orderItems[]): number {
    const uniqueCosts = Array.from(new Set(orderItems.map(item => item.cost)));
    return uniqueCosts.length === 1 ? uniqueCosts[0] : NaN;
}

getOrderFoodImage(foodImage: string): string {
  const orderItem = this.orderItems.find(item => item.item === foodImage);
  return orderItem ? orderItem.foodImage : '';
}

getOrderItem(itemName: string): string {
  const orderItem = this.orderItems.find(item => item.item === itemName);
  return orderItem ? orderItem.item : '';
}
}
