import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }
  
  getOrders(cusId: number): Observable<any> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }


    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseApiUrl}api/OrderStatus/GetOrderStatus/${cusId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching orders by customer ID:', error);
        return throwError('Error fetching orders by customer ID. Please try again later.');
      })
    );
  }

  loadItems(): Observable<any> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseApiUrl}api/Item/GetAllItem`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching items:', error);
        return throwError('Error fetching items. Please try again later.');
      })
    );
  }
}
