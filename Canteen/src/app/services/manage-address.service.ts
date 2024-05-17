import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Address } from '../models/manage-address.model';

@Injectable({
  providedIn: 'root'
})
export class ManageAddressService {

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

  getAllAddress(): Observable<ApiResponseMessage<Address[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Address[]>>(`${this.baseApiUrl}api/Address/GetAllAddress`, { headers })
      .pipe(catchError(this.handleError));
  }

  addAddress(AddAddress: Address): Observable<ApiResponseMessage<Address[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<Address[]>>(`${this.baseApiUrl}api/Address/AddAddress`,  AddAddress)
    .pipe(catchError(this.handleError));
  }

  editAddress(UpdateAddress: Address): Observable<ApiResponseMessage<Address[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<Address[]>>(`${this.baseApiUrl}api/Address/UpdateAddress`,  UpdateAddress)
    .pipe(catchError(this.handleError));
  }

  
  deleteAddress(AddressId: number): Observable<ApiResponseMessage<Address>> {
    const headers = new HttpHeaders(); 
    return this.http.delete<ApiResponseMessage<Address>>(`${this.baseApiUrl}api/Address/DeleteAddress/${AddressId}`, { headers })
    .pipe(catchError(this.handleError));
  }
}
