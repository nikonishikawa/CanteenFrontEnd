import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Address, Membership, genAddress, getAllUser, userStatus } from '../models/manage-user.model';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

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

  getAllUser(): Observable<ApiResponseMessage<getAllUser[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<getAllUser[]>>(`${this.baseApiUrl}api/Customer/GetAllCustomer`, { headers })
      .pipe(catchError(this.handleError));
  }

  getItemById(itemID: number): Observable<ApiResponseMessage<Menu>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Menu>>(`${this.baseApiUrl}api/Item/GetItem?itemId=/${itemID}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getMembershipById(MemberShipId: number): Observable<ApiResponseMessage<Membership>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Membership>>(`${this.baseApiUrl}api/Membership/GetMembership/${MemberShipId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getAddressById(genAddressId: number): Observable<ApiResponseMessage<genAddress>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<genAddress>>(`${this.baseApiUrl}api/GeneralAddress/GetGeneralAddress/${genAddressId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getUserStatusId(userStatusId: number): Observable<ApiResponseMessage<userStatus>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<userStatus>>(`${this.baseApiUrl}api/UserStatus/GetUserStatus/${userStatusId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
