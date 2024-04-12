import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { Customer } from '../../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toaster: ToastrService
  ) { }

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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Redirect to login page
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            })
        );
    }
}
