
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import { orderItems, orders } from '../../../models/orders.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrayItemsDTO } from '../../../models/tray.model';
import { Menu } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { Customer, CustomerById } from '../../../models/user.model';
import { CustomerService } from '../../../services/customer.service';
import { ApiResponseMessage } from '../../../models/apiresponsemessage.model';
import { Component, OnInit } from '@angular/core';
import { getAllUser } from '../../../models/manage-user.model';

@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.css'
})

export class ManageOrderComponent implements OnInit {
  customer: CustomerById = {} as CustomerById;
  tray: TrayItemsDTO = {} as TrayItemsDTO;
  orderItems: orderItems[] =  [];
  order: orders = {} as orders;
  menus: Menu[] = [];
  orderItemsMap: { [orderId: number]: orderItems[] } = {};
  // orderGroups: { orderId: number; modeOfPayment: string; status: string; orderStamp: string; cost:number; orderItems: orderItems[] }[] = [];
  orderGroups: any[] = [];
  openOrderItem: any = null;
  showFirstContent: boolean = false;
  users: getAllUser[] = [];
  userNames: { cusName: number; firstName: string; middleName: string; lastName: string; }[] = [];
  

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private orderService: OrderService,
    private menuService: MenuService,
    private customerService: CustomerService,
  ) { }
  
  ngOnInit(): void {
    this.getOrders();
  }


  getOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res: { isSuccess: boolean, data: orderItems[], message: string }) => {
        if (res.isSuccess) {  
          this.orderItems = res.data;
          console.log("Response", res);
          const customerId = this.extractCustomerId(res.data); // Extract customer ID
          this.getCustomerId(customerId); // Fetch customer details using the extracted ID
          this.orderItems.forEach(orderItem => {
            this.loadItem(orderItem.item, orderItem);
          });
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
  
  extractCustomerId(data: orderItems[]): number {
    return data.length > 0 ? data[0].cusId : 0;
  }
  
  getCustomerId(customerId: number): void {
    this.customerService.getCustomerById(customerId).subscribe({
      next: (res: ApiResponseMessage<CustomerById>) => {
        const customer = res.data; 
        this.customer = customer; 
        console.log("CustomerId Response", res);
      },
      error: (err) => {
        console.error('Error retrieving customer ID:', err);
      }
    });
  }
  


  loadItem(itemId: string, orderItem: any) {
    this.orderService.getItemById(itemId).subscribe({
      next: (res) => {
        orderItem.foodImage = res.data.foodImage;
        orderItem.item = res.data.item;
      }
    });
  }

  loadCustomerName() {
    this.users.forEach(user => {
      this.customerService.getCustomerName(user.cusName).subscribe({
        next: (res) => {
          this.userNames.push({ cusName: user.cusName, firstName: res.data.firstName, middleName: res.data.middleName, lastName: res.data.lastName });
        },
        error: (error) => {
          console.error('Error loading Customer Name:', error);
        }
      });
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

  getUserFirstName(cusName: number): string {
    const user = this.userNames.find(u => u.cusName === cusName);
    return user ? user.firstName : '';
  }

  getNameValue(group: any): string {
    const firstOrderItem = group.orderItems[0]; 
    return firstOrderItem ? firstOrderItem.name : '';
  }
}
