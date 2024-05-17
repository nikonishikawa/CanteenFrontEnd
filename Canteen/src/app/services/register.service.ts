import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Register } from '../models/register.model';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Address } from '../models/manage-user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  
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

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError('An error occurred. Please try again later.');
  }

  RegisterIn(RegisterUser: Register): Observable<ApiResponseMessage<Register>> {
    return this.http.post<ApiResponseMessage<Register>>(this.baseApiUrl + 'api/UserCredential/RegisterUser', RegisterUser);
  }

  getAddress(): Observable<ApiResponseMessage<Address[]>> {
    return this.http.get<ApiResponseMessage<Address[]>>(`${this.baseApiUrl}api/Address/GetAllAddress`)
      .pipe(catchError(this.handleError));
  }

  RegisterVendor(RegisterVendor: Register): Observable<ApiResponseMessage<Register>> {
    return this.http.post<ApiResponseMessage<Register>>(this.baseApiUrl + 'api/UserCredential/RegisterVendor', RegisterVendor)
    .pipe(catchError(this.handleError));
  }

}
