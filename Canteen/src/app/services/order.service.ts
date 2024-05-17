import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Menu } from '../models/menu.model';
import { orderItems, status } from '../models/orders.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

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

  getOrders(cusId: number): Observable<ApiResponseMessage<orderItems[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<orderItems[]>>(`${this.baseApiUrl}api/OrderStatus/GetOrderStatus/${cusId}`, { headers })
    .pipe(catchError(this.handleError));
  }

  updateOrderStatusCompleted(orderId: number, newStatus: number): Observable<ApiResponseMessage<string>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<string>>(`${this.baseApiUrl}api/OrderStatus/UpdateOrderCompleted?orderId=${orderId}&newStatus=${newStatus}`, { headers })
    .pipe(catchError(this.handleError));
  }

   updateOrderStatus(orderId: number, newStatus: number): Observable<ApiResponseMessage<string>> {
    const headers = this.getHeaders();
    return this.http.put<ApiResponseMessage<string>>(`${this.baseApiUrl}api/OrderStatus/UpdateOrderStatus?orderId=${orderId}&newStatus=${newStatus}`, { headers })
    .pipe(catchError(this.handleError));
  }

  getAllOrders(): Observable<ApiResponseMessage<orderItems[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<orderItems[]>>(`${this.baseApiUrl}api/OrderStatus/GetAllOrders`, { headers })
      .pipe(catchError(this.handleError));
  }

  loadItemsById(): Observable<ApiResponseMessage<string>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<string>>(`${this.baseApiUrl}api/Item/GetAllItem`, { headers })
      .pipe(catchError(this.handleError));
  }
  getTrayStatus(): Observable<ApiResponseMessage<status[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<status[]>>(`${this.baseApiUrl}api/TrayStatus/GetAllTrayStatus`, { headers })
      .pipe(catchError(this.handleError));
  }

  getItemById(itemId: number | string): Observable<ApiResponseMessage<Menu>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Menu>>(`${this.baseApiUrl}api/Item/GetItem/${itemId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getStatus(itemId: number | string): Observable<ApiResponseMessage<Menu>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Menu>>(`${this.baseApiUrl}api/Item/GetItem/${itemId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
