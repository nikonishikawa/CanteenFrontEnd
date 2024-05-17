import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerDto, TrayItemsDTO } from '../../../models/tray.model';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Customer } from '../../../models/user.model';
import { orderItems, orders, status } from '../../../models/orders.model';
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
  status: status[] = [];
  order: orders = {} as orders;
  menus: Menu[] = [];
  orderItemsMap: { [orderId: number]: orderItems[] } = {};
  // orderGroups: { orderId: number; modeOfPayment: string; status: string; orderStamp: string; cost:number; orderItems: orderItems[] }[] = [];
  orderGroups: any[] = [];
  openOrderItem: any = null;
  showFirstContent: boolean = false;
  
  selectedStatus: string = 'All';
  filterSelected: any = null;
  currentIndex: number = 0;
  activeIndex: number = 0;
  isActive!: number | 1;
 

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private menuService: MenuService,
    private customerService: CustomerService,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadStatus();
    this.loadCustomerData();
  
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        this.customer.customerId = res.data.customerId;
        this.getOrders(this.selectedStatus, this.currentIndex);
      }
    });
  }
  
  getOrders(selectedStatus: string, index: number) {
    if (!this.customer.customerId) {
      console.error('Customer ID not found');
      return;
    }
  
    this.orderService.getOrders(this.customer.customerId).subscribe({
      next: (res) => {
        if (res.isSuccess) {  
          this.orderItems = res.data;
          this.orderItems.forEach(orderItem => {
            this.loadItem(orderItem.item, orderItem);
          });
          if (this.orderItems && this.orderItems.length > 0) {
            this.preprocessOrderItems(this.orderItems, selectedStatus, index); 
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

  loadStatus() {
    this.orderService.getTrayStatus().subscribe({
      next: (res: { isSuccess: boolean, data: status[], message: string }) => {
        if (res.isSuccess){
          this.status = res.data;
        }
      }
    })
  }

  getStatusName(categoryId: number): string | number {
    const categoryIdNumber = parseInt(categoryId.toString(), 10);
    const correspondingCategory = this.status.find(cat => cat.statusId === categoryIdNumber);
    this.isActive = categoryIdNumber;
    return correspondingCategory ? correspondingCategory.status : categoryId;
  }

  loadItem(itemId: string, orderItem: any) {
    this.orderService.getItemById(itemId).subscribe({
      next: (res) => {
        orderItem.foodImage = res.data.foodImage;
        orderItem.item = res.data.item;
      }
    });
  }
  
  openModal(orderId: number) {
    this.openOrderItem = this.openOrderItem === orderId ? null : orderId;
  }
  
  getAllMenus() {
    this.menuService.getAllMenu().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.menus = res.data;

          if (this.menus && this.menus.length > 0) {
            this.menus.forEach(menuItem => {
              if (menuItem && menuItem) {
                menuItem.itemId
                menuItem.item
                menuItem.description
                menuItem.isHalal
                menuItem.price
                menuItem.category
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

  preprocessOrderItems(orderItems: orderItems[], selectedStatus: string, index: number): void {
    let filteredOrderItems: orderItems[];
    
    if (selectedStatus === 'All') {
      filteredOrderItems = orderItems;
      this.filtSelect(0);
    } else {
      filteredOrderItems = this.filterStatus(orderItems, selectedStatus, index);
    }

    const orderGroupsMap: { [orderId: number]: orderItems[] } = {};
    filteredOrderItems.forEach(orderItem => {
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
    })).sort((a, b) => new Date(b.orderStamp).getTime() - new Date(a.orderStamp).getTime());
  }

  filterStatus(orderItems: orderItems[], index: string, currentIndex: number): orderItems[] {
    this.filtSelect(currentIndex);
    return orderItems.filter(item => item.statusName === index);
  }

  filtSelect(index: number) {
    this.filterSelected = index;
    this.setActiveIndex(this.filterSelected);  
  }

  setActiveIndex(index: number | 0) {
    this.activeIndex = index;
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