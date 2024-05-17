import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { UpdateVendorDto } from '../models/load-data.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

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

  loadVendorData(): Observable<ApiResponseMessage<UpdateVendorDto>> {
    const headers = this.getHeaders();
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return new Observable<ApiResponseMessage<UpdateVendorDto>>(observer => {
      });
    }
    const url = `${this.baseApiUrl}api/Vendor/GetVendor?vendorCredentials=${userId}`;

    return this.http.get<ApiResponseMessage<UpdateVendorDto>>(url, { headers });
  }

}
