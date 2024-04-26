import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerDto } from '../../../models/tray.model';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Customer } from '../../../models/user.model';
import { orderItems } from '../../../models/orders.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})

export class OrderComponent {
  customer: Customer = {} as Customer;
  orderItems: orderItems = {} as orderItems;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadCustomerData();
    // this.getOrders();
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        this.customer.customerId = res.data.customerId;
        console.log('Received customer data:', res.data.customerId);
        this.getOrders();
      }
    });
  }
  
  getOrders() {
    if (!this.customer.customerId) {
      console.error('Customer ID not found');
      return;
    }
  
    this.orderService.getOrders(this.customer.customerId).subscribe({
      next: (res) => {
        console.log('Received order data:', res);
      }
    });
  }
}
