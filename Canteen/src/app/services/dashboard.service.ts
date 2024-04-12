import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/user.model';
import { Observable, throwError } from 'rxjs';
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
          // Split the token into its three parts: header, payload, and signature
          const [header, payload, signature] = loginToken.split('.');
  
          // Decode the payload
          const decodedPayload = JSON.parse(atob(payload));
  
          // Check if the decoded payload contains the user ID
          const userId = decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          if (userId) {
            console.log(userId);
            return userId;
          } else {
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
      return throwError('User ID not found');
    }
  
    const loginToken = localStorage.getItem('loginToken');
    if (!loginToken) {
      console.error('Login token not found');
      return throwError('Login token not found');
    }
  
    const headers = { 'Authorization': `Bearer ${loginToken}` };
    const url = `${this.baseApiUrl}api/Customer/GetCustomer?cusCredential=${userId}`;
  
    return this.http.get<ApiResponseMessage<Customer>>(url, { headers });
  }
  
}

// return JSON.parse(atob(loginToken.split('.')[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];