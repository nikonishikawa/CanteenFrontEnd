import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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

  loadAdminData(): Observable<ApiResponseMessage<Admin>> {
    const headers = this.getHeaders();
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return new Observable<ApiResponseMessage<Admin>>(observer => {
      });
    }
    const url = `${this.baseApiUrl}api/Admin/GetAdmin?AdminCredentials=${userId}`;

    return this.http.get<ApiResponseMessage<Admin>>(url, { headers });
  }
}
