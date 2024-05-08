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

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toaster: ToastrService,
    private loadDataService: LoadDataService
  ) { }

  ngOnInit() {
    this.loadCustomerData();
    this.loadOrders(); // Call method to load orders
  }

  loadOrders() {
    this.loadDataService.getTopOrder().subscribe({
      next: (res: ApiResponseMessage<Order[]>) => {
        console.log('Received orders:', res);
        this.orders = res.data;
        this.calculateDailySales(); 
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res);
        this.customer = res.data;
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
  

  getMostSoldItems(): { itemName: string; price: number; foodImage: string }[] {
    const today = new Date().toLocaleDateString();
    const topItems = this.getMostSoldItemsForDate(today);
  
    return topItems.map(itemName => {
      const order = this.orders.find(order => order.itemName === itemName);
      if (order) {
        return {
          itemName: order.itemName,
          price: order.price,
          foodImage: order.foodImage
        };
      } else {
        return { itemName: itemName, price: 0, foodImage: '' }; 
      }
    });
  }
  
  
  private getMostSoldItemsForDate(date: string): string[] {
    const itemSales = this.dailySales.get(date);
    if (!itemSales) return [];
    const sortedItems = Array.from(itemSales.entries()).sort((a, b) => b[1] - a[1]); 
    return sortedItems.slice(0, 5).map(([item, quantity]) => item); 
  }
  
}