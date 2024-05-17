import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { getAllVendor } from '../models/manage-vendor.model';
import { UpdateVendorDto } from '../models/load-data.model';

@Injectable({
  providedIn: 'root'
})
export class ManageVendorService {

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

  getAllVendor(): Observable<ApiResponseMessage<getAllVendor[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<getAllVendor[]>>(`${this.baseApiUrl}api/Vendor/GetAllVendorList`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateVendor(updateVendorDto: UpdateVendorDto): Observable<ApiResponseMessage<UpdateVendorDto>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<UpdateVendorDto>>(`${this.baseApiUrl}api/Vendor/UpdateVendor`, updateVendorDto, { headers })
      .pipe(catchError(this.handleError));
  }
}