import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/user.model';
import { Observable } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getUserIdFromToken(): string {
    if (typeof localStorage !== 'undefined') {
      const loginToken = localStorage.getItem('loginToken');
      if (loginToken) {
        return JSON.parse(atob(loginToken.split('.')[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      } else {
        console.error('Login token not found');
        return '';
      }
    } else {
      console.error('localStorage is not available');
      return '';
    }
  }

  loadCustomerData(): Observable<ApiResponseMessage<Customer>> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found');
      return new Observable<ApiResponseMessage<Customer>>(observer => {
        observer.error('User ID not found');
      });
    }

    const loginToken = localStorage.getItem('loginToken');
    const headers = { 'Authorization': `Bearer ${loginToken}` };
    const url = `${this.baseApiUrl}api/Customer/GetCustomer?cusCredential=${userId}`;

    return this.http.get<ApiResponseMessage<Customer>>(url, { headers });
  }
}