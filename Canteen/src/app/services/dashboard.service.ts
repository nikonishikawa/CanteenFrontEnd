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
      console.log(loginToken);
      if (loginToken) {
        try {
          const [header, payload, signature] = loginToken.split('.');
          const decodedPayload = JSON.parse(atob(payload));
  
          const userId = decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          if (userId) {
            console.log(userId);
            return userId;
          } else {
            console.error('User ID not found in decoded payload');
            return '';
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          return '';
        }
      } else {
        console.error('Login token not found');
        return '';
      }
    } else {
      return '';
    }
  }

  loadCustomerData(): Observable<ApiResponseMessage<Customer>> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return new Observable<ApiResponseMessage<Customer>>(observer => {
      });
    }

    const loginToken = localStorage.getItem('loginToken');
    const headers = { 'Authorization': `Bearer ${loginToken}` };
    const url = `${this.baseApiUrl}api/Customer/GetCustomer?cusCredential=${userId}`;

    return this.http.get<ApiResponseMessage<Customer>>(url, { headers });
  }
}