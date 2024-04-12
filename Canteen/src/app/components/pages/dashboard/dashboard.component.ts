import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { Customer } from '../../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../../AuthInterceptor/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
}
)



export class DashboardComponent implements OnInit {
  customer: Customer = new Customer();
  toaster=inject(ToastrService);
  
  constructor(private dashboardService: DashboardService, private router: Router) { }

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
      }
    });
  }
}

