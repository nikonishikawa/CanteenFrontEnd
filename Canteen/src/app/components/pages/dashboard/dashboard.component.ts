import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { Customer } from '../../../models/user.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  customer: Customer = new Customer();

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadCustomerData();
  }

  loadCustomerData() {
    this.dashboardService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res);
        this.customer = res.data;
        console.log(this.customer.cusCredentials);
        console.log(this.customer.cusName);
      },
      error: (err) => {
        console.error('Error fetching customer data:', err);
      }
    });
  }
}

