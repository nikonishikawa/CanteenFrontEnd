import { Component, Injectable, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomerService } from '../../../services/customer.service';
import { LoadDataService } from '../../../services/load-data.service';
import { Order } from '../../../models/menu.model';
import { ApiResponseMessage } from '../../../models/apiresponsemessage.model';
import { UserOrderData, orderItems } from '../../../models/orders.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
}
)

export class DashboardComponent implements OnInit {
  customer: Customer = {} as Customer;
  orders: Order[] = [];
  dailySales: Map<string, Map<string, number>> = new Map();
  openOrderItem: number | null = null;
  orderItems: orderItems[] =  [];
  userOrders: UserOrderData[] = [];
  userTransaction: UserOrderData[] = [];
  

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toaster: ToastrService,
    private loadDataService: LoadDataService
  ) { }

  ngOnInit() {
    this.loadOrders(); 
    this. loadCustomerData();
  }

  loadOrders() {
    this.loadDataService.getTopOrder().subscribe({
      next: (res) => {
        console.log('Received orders:', res);
        const currentDate = new Date().toLocaleDateString(); 
        const filteredOrders = res.data.filter(order => {
          const completedDate = new Date(order.completedStamp).toLocaleDateString();
          return completedDate === currentDate; 
        });
        this.orders = filteredOrders;
        this.calculateDailySales(); 
        this.getMostSoldItems();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  loadRecentlyOrdered() {
    this.loadDataService.getRecentOrdersById(this.customer.customerId).subscribe({
      next: (res) => {
        console.log('Received Recently Ordered:', res);
        this.getRecentlySold();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  loadUserOrders() {
    this.loadDataService.getUserOrders(this.customer.customerId).subscribe({
      next: (res) => {
        console.log('Received User Orders:', res);
        this.userOrders = this.getUserOrders(res.data); 
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  loadUserRecentTransactions(){
    this.loadDataService.getRecentUserTransaction(this.customer.customerId).subscribe({
      next: (res) => {
        console.log('Received User Recent Transaction:', res);
        const sortedTransactions = res.data.sort((a, b) => {
          return new Date(b.orderStamp).getTime() - new Date(a.orderStamp).getTime();
        });
        this.userTransaction = this.getUserOrders(sortedTransactions.slice(0, 5));
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }
  

  calculateDailySales(): void {
    this.orders.forEach(order => {
      const date = new Date(order.completedStamp).toLocaleDateString();
      if (!this.dailySales.has(date)) {
        this.dailySales.set(date, new Map());
      }
      const itemSales = this.dailySales.get(date);
      const totalQuantity = order.quantity;
      if (itemSales) { 
        if (itemSales.has(order.itemName)) {
          itemSales.set(order.itemName, itemSales.get(order.itemName)! + totalQuantity);
        } else {
          itemSales.set(order.itemName, totalQuantity);
        }
      }
    });
  }
  
  getMostSoldItems(): { itemName: string; price: number; foodImage: string; orderId: number;}[] {
    const today = new Date().toLocaleDateString();
    const topItems = this.getMostSoldItemsForDate(today);
  
    return topItems.map(itemName => {
      const order = this.orders.find(order => order.itemName === itemName);
      if (order) {
        return {
          itemName: order.itemName,
          price: order.price,
          foodImage: order.foodImage,
          quantity: order.quantity,
          orderId: order.orderId
        };
      } else {
        return { itemName: itemName, price: 0, foodImage: '', orderId: 0 }; 
      }
    });
  }

  getRecentlySold(): { orderId: number; totalPrice: number; items: { itemName: string; price: number; foodImage: string; quantity: number; orderId: number; }[] }[] {
    const today = new Date().toLocaleDateString();
    const ordersGroupedByOrderId = this.groupOrdersByOrderId(today);
    
    return ordersGroupedByOrderId.map(orderGroup => ({
      orderId: orderGroup.orderId,
      totalPrice: orderGroup.price,
      items: orderGroup.items.map(item => ({
        itemName: item.itemName,
        price: item.price,
        foodImage: item.foodImage,
        quantity: item.quantity,
        orderId: item.orderId
      }))
    }));
  }

  getUserOrders(data: Order[]): { orderId: number; totalPrice: number; items: { itemName: string; price: number; foodImage: string; quantity: number; orderId: number; }[] }[] {
    const ordersGroupedByOrder = this.groupOrdersByOrder(data); 
    
    return ordersGroupedByOrder.map(orderGroup => ({
      orderId: orderGroup.orderId,
      totalPrice: orderGroup.price,
      items: orderGroup.items.map(item => ({
        itemName: item.itemName,
        price: item.price,
        foodImage: item.foodImage,
        quantity: item.quantity,
        orderId: item.orderId
      }))
    }));
  }
  
  groupOrdersByOrderId(date: string): { orderId: number; items: Order[]; price: number }[] {
    const filteredOrders = this.orders.filter(order => new Date(order.completedStamp).toLocaleDateString() === date);
    
    filteredOrders.sort((a, b) => new Date(b.completedStamp).getTime() - new Date(a.completedStamp).getTime());
  
    const ordersGroupedByOrderId: { [orderId: number]: Order[] } = {};
    filteredOrders.forEach(order => {
      const orderId = order.orderId;
      if (!ordersGroupedByOrderId[orderId]) {
        ordersGroupedByOrderId[orderId] = [];
      }
      ordersGroupedByOrderId[orderId].push(order);
    });
  
    const groupedOrders: { orderId: number; items: Order[]; price: number }[] = [];
    Object.keys(ordersGroupedByOrderId).forEach(orderId => {
      const orders = ordersGroupedByOrderId[Number(orderId)];
      const totalPrice = this.getTotalPrice(orders);
      groupedOrders.push({ orderId: Number(orderId), items: orders, price: totalPrice });
    });
  
    return groupedOrders;
  }
  
  getTotalPrice(orders: Order[]): number {
    return orders.reduce((total, order) => total + (order.price * order.quantity), 0);
  }

  private getMostSoldItemsForDate(date: string): string[] {
    const itemSales = this.dailySales.get(date);
    if (!itemSales) return [];
    const sortedItems = Array.from(itemSales.entries()).sort((a, b) => b[1] - a[1]); 
    return sortedItems.slice(0, 5).map(([item, quantity]) => item); 
  }

  groupOrdersByOrder(data: Order[]): { orderId: number; items: Order[]; price: number }[] {
    const ordersGroupedByOrder: { [orderId: number]: Order[] } = {};

    data.forEach(order => { 
      const orderId = order.orderId;
      if (!ordersGroupedByOrder[orderId]) {
        ordersGroupedByOrder[orderId] = [];
      }
      ordersGroupedByOrder[orderId].push(order);
    });

    const groupedOrders: { orderId: number; items: Order[]; price: number }[] = [];
    Object.keys(ordersGroupedByOrder).forEach(orderId => {
      const orders = ordersGroupedByOrder[Number(orderId)];
      const totalPrice = this.getTotalPrice(orders);
      groupedOrders.push({ orderId: Number(orderId), items: orders, price: totalPrice });
    });

    return groupedOrders;
  }
  
  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res);
        this.customer = res.data;
        this.loadOrders(); 
        this.loadRecentlyOrdered();
        this.loadUserOrders();
        this.loadUserRecentTransactions();
      }
    });
  }
}
