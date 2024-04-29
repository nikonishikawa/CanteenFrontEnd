import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Customer, CustomerName, address, customerGeneralAddress } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    if (typeof localStorage === 'undefined') {
      throw new Error('Local storage not available');
    }
    
    const token = localStorage.getItem('loginToken');

    if (!token) {
      throw new Error('Token not found');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserIdFromToken(): string {
    if (typeof localStorage !== 'undefined') {
      const loginToken = localStorage.getItem('loginToken');
      if (loginToken) {
        try {
          const [header, payload, signature] = loginToken.split('.');
          const decodedPayload = JSON.parse(atob(payload));
  
          const userId = decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          if (userId) {
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
    const headers = this.getHeaders();
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return new Observable<ApiResponseMessage<Customer>>(observer => {
      });
    }
    const url = `${this.baseApiUrl}api/Customer/GetCustomer?cusCredential=${userId}`;

    return this.http.get<ApiResponseMessage<Customer>>(url, { headers });
  }

   getCustomerName(nameId: number): Observable<ApiResponseMessage<CustomerName>> {
    const headers = this.getHeaders();

    const url = `${this.baseApiUrl}api/Name/GetName/${nameId}`;

    return this.http.get<ApiResponseMessage<CustomerName>>(url, { headers });
   }

   getCustomerAddress(genAddressId: number): Observable<ApiResponseMessage<customerGeneralAddress>> {
    const headers = this.getHeaders();

    const url = `${this.baseApiUrl}api/GeneralAddress/GetGeneralAddress/${genAddressId}`;

    return this.http.get<ApiResponseMessage<customerGeneralAddress>>(url, { headers });
   }

   getAddress(addressId: number): Observable<ApiResponseMessage<address>> {
    const headers = this.getHeaders();

    const url = `${this.baseApiUrl}api/Address/GetAddressById/${addressId}`;

    return this.http.get<ApiResponseMessage<address>>(url, { headers });
   }

   editName(CustomerName: CustomerName): Observable<ApiResponseMessage<CustomerName>> {
    const headers = this.getHeaders();
    // const updateName = {
    //   nameId: nameId,
    //   firstName: firstName,
    //   middleName: middleName,
    //   lastName: lastName 
    // }
    const url = `${this.baseApiUrl}api/Name/UpdateName`;

    return this.http.put<ApiResponseMessage<CustomerName>>(url, CustomerName, { headers });
   }
}