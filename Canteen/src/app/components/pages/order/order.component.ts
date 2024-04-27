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
  orderItems: orderItems[] =  [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
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
        next: (res: { isSuccess: boolean, data: orderItems[], message: string }) => {
            if (res.isSuccess) {
                this.orderItems = res.data;
                console.log("Response", res);
                if (this.orderItems && this.orderItems.length > 0) {
                    this.orderItems.forEach(orderItem => {
                         orderItem.orderItemId
                         orderItem.orderId
                         orderItem.item
                         orderItem.quantity
                         orderItem.price
                         orderItem.orderStamp
                         orderItem.cost
                         orderItem.modeOfPayment
                    });
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


}
