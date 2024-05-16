import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import { loadItem, orderGroupsDto, orderItems, orders, status } from '../../../models/orders.model';
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
  selector: 'app-vendor-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-order.component.html',
  styleUrl: './vendor-order.component.css'
})

export class VendorOrderComponent implements OnInit {
  customer: CustomerById = {} as CustomerById;
  tray: TrayItemsDTO = {} as TrayItemsDTO;
  orderItems: orderItems[] =  [];
  orderItem: loadItem[] = [];
  status: status[] = [];
  order: orders = {} as orders;
  menus: Menu[] = [];
  orderItemsMap: { [orderId: number]: orderItems[] } = {};
  activeIndex: number = 0;
  groupedOrder: { [key: string]: orderItems[] } = {};
  orderGroups: orderGroupsDto[] = [];
  openOrderItem: number = 0;
  showFirstContent: boolean = false;
  selectedStatus: string = 'All';
  filteredStatus: number = 0;
  filterSelected: number = 0;
  isActive!: number | 1;
  currentIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private orderService: OrderService,
    private menuService: MenuService,
    private customerService: CustomerService,
  ) { }
  
  ngOnInit(): void {
    
    this.getOrders(this.selectedStatus, this.currentIndex);
    
    this.loadStatus();
  }  

  editStatus(orderId: number, newStatus: number) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log("Status updated successfully");
          this.getOrders(this.selectedStatus, this.currentIndex); 
        } else {
          console.error("Error updating status:", res.message);
        }
      },
      error: (error) => {
        console.error("Error updating status:", error);
      }
    });
  }
  
  editStatusCompleted(orderId: number, newStatus: number) {
    this.orderService.updateOrderStatusCompleted(orderId, newStatus).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log("Status updated successfully");
          this.getOrders(this.selectedStatus, this.currentIndex); 
        } else {
          console.error("Error updating status:", res.message);
        }
      },
      error: (error) => {
        console.error("Error updating status:", error);
      }
    });
  }
  
  
  getOrders(selectedStatus: string, index: number) {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.orderItems = res.data;
          
          console.log("Response", res);
          this.orderItems.forEach(orderItem => {
            this.loadItem(orderItem.item, orderItem);
          });
          if (this.orderItems && this.orderItems.length > 0) {
            
            this.preprocessOrderItems(this.orderItems, selectedStatus, index);
            console.log("this: " + selectedStatus);
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
      next: (res) => {
        if (res.isSuccess){
          this.status = res.data;
          console.log("Status", res)
        }
      }
    })
  }

  getStatusName(categoryId: any): any {
    console.log(categoryId);
    const categoryIdNumber = parseInt(categoryId, 10);
    const correspondingCategory = this.status.find(cat => cat.statusId === categoryIdNumber);
    this.isActive = categoryIdNumber;
    console.log(categoryIdNumber, correspondingCategory);
    return correspondingCategory ? correspondingCategory.status : categoryId;
  }

  loadItem(itemId: string, orderItem: loadItem) {
    this.orderService.getItemById(itemId).subscribe({
      next: (res) => {
        orderItem.foodImage = res.data.foodImage;
        orderItem.item = res.data.item;
      }
    });
  }

  openModal(orderId: number) {
    this.openOrderItem = this.openOrderItem === orderId ? 0 : orderId;
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
      orderItems: orderGroupsMap[Number(orderId)],
      firstName: String(orderGroupsMap[Number(orderId)][0].firstName) 
    }));
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

  getSelectActive(index: number) {
    this.isActive = index === 6 ? 1 : (index === this.isActive ? 1 : index);
  }

  getUniqueModeOfPayment(orderItems: orderItems[]): string {
    const uniqueModeOfPayments = Array.from(new Set(orderItems.map(item => item.modeOfPayment)));
    return uniqueModeOfPayments.length === 1 ? uniqueModeOfPayments[0] : 'Multiple';
  }

  getUniqueStatus(orderItems: orderItems[]): string {
    const uniqueStatuses = Array.from(new Set(orderItems.map(item => item.status)));
    return uniqueStatuses.length === 1 ? uniqueStatuses[0] : 'Multiple';
  }

  getUniqueOrderStamp(orderItems: orderItems[]): string {
    const uniqueorderStamp = Array.from(new Set(orderItems.map(item => item.orderStamp)));
    return uniqueorderStamp.length === 1 ? uniqueorderStamp[0] : 'Multiple';
  }

  getUniqueCost(orderItems: orderItems[]): number {
    const uniqueCosts = Array.from(new Set(orderItems.map(item => item.cost)));
    return uniqueCosts.length === 1 ? uniqueCosts[0] : NaN;
  }
}