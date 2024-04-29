import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

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

  getOrders(cusId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseApiUrl}api/OrderStatus/GetOrderStatus/${cusId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching orders by customer ID:', error);
        return throwError('Error fetching orders by customer ID. Please try again later.');
      })
    );
  }

  loadItems(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseApiUrl}api/Item/GetAllItem`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching items:', error);
        return throwError('Error fetching items. Please try again later.');
      })
    );
  }
}


// loadItems() {
//   this.orderService.loadItems().subscribe({
//     next: (res) => {
//       this.orderItems
//       console.log('Received order data:', res.data);
//     }
//   });
// }