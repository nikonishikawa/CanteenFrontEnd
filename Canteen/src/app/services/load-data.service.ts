import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Membership, Position, TotalRev, UserStatus } from '../models/load-data.model';
import { Order } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

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

  getUserStatus(): Observable<ApiResponseMessage<UserStatus[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<UserStatus[]>>(`${this.baseApiUrl}api/UserStatus/GetAllUserStatus`, { headers })
      .pipe(catchError(this.handleError));
  }

  getTotalRev(): Observable<ApiResponseMessage<TotalRev[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<TotalRev[]>>(`${this.baseApiUrl}api/OrderCompleted/GetTotalRev`, { headers })
      .pipe(catchError(this.handleError));
  }

  getMembership(): Observable<ApiResponseMessage<Membership[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Membership[]>>(`${this.baseApiUrl}api/Membership/GetAllMembership`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPosition(): Observable<ApiResponseMessage<Position[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Position[]>>(`${this.baseApiUrl}api/Position/GetAllPosition`, { headers })
      .pipe(catchError(this.handleError));
  }


  getTopOrder(): Observable<ApiResponseMessage<Order[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Order[]>>(`${this.baseApiUrl}api/OrderCompleted/GetAllOrderCompleted`, { headers })
      .pipe(catchError(this.handleError));
  }

  getUserOrders(cusId: number): Observable<ApiResponseMessage<Order[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Order[]>>(`${this.baseApiUrl}api/OrderStatus/GetOnGoingOrder/${cusId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getRecentUserTransaction(cusId: number): Observable<ApiResponseMessage<Order[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Order[]>>(`${this.baseApiUrl}api/OrderStatus/GetUserOrder/${cusId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getRecentOrdersById(cusId: number): Observable<ApiResponseMessage<Order[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Order[]>>(`${this.baseApiUrl}api/OrderCompleted/GetRecentOrdersById/${cusId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
