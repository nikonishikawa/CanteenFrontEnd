import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Menu } from '../models/menu.model';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { status } from '../models/orders.model';

@Injectable({
  providedIn: 'root'
})
export class ManageMenuService {

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

  addMenu(item: string, description: string, foodImage: string, isHalal: number, price: number, stocks: number,  category: number, categoryName: string): Observable<ApiResponseMessage<string>> {
    const headers = this.getHeaders();
    const url = `${this.baseApiUrl}api/Item/InsertItem`; 
    const insertMenu = {
      Item: item,
      Description: description,
      FoodImage: foodImage,
      IsHalal: isHalal,
      Price: price,
      Stock: stocks,
      Category: category
    };
    return this.http.post<ApiResponseMessage<string>>(url, insertMenu, { headers })
      .pipe(catchError(this.handleError));
  }

  updateItemStock(itemId: number, newStock: number): Observable<ApiResponseMessage<string>> {
    const dto = { itemId, stock: newStock };
    return this.http.put<ApiResponseMessage<string>>(`${this.baseApiUrl}api/Item/UpdateItemById?itemId=${itemId}&newStock=${newStock}`, dto);
  }
  


}
