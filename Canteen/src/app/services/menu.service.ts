import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Menu } from '../models/menu.model';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Category } from '../models/category.model';
import { MOP } from '../models/orders.model';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  
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

  getAllMenu(): Observable<ApiResponseMessage<Menu[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Menu[]>>(`${this.baseApiUrl}api/Item/GetAllItem`, { headers })
      .pipe(catchError(this.handleError));
  }

  getAllCaetegory(): Observable<ApiResponseMessage<Category[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<Category[]>>(`${this.baseApiUrl}api/Category/GetAllCategory`, { headers })
      .pipe(catchError(this.handleError));
  }

  getItemsByTrayTempId(trayTempId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseApiUrl}api/TrayItem/tray/${trayTempId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  GetTraytempId(cusId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseApiUrl}api/TrayItem/GetTrayTempId/${cusId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteTrayItem(trayItemTempId: number): Observable<ApiResponseMessage<string>> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    const url = `${this.baseApiUrl}api/TrayItem/RemoveTrayItemTemp/${trayItemTempId}`;
    return this.http.delete<ApiResponseMessage<string>>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  addMenu(addMenuRequest: Menu): Observable<Menu> {
    const headers = this.getHeaders();
    return this.http.post<Menu>(`${this.baseApiUrl}api/Item/InsertItem`, addMenuRequest, { headers })
      .pipe(catchError(this.handleError));
  }

  insertOrderStatus(CusId: number, OrderStamp: string, Cost: number, ModeOfPayment: number): Observable<ApiResponseMessage<string>>  {
    const headers = this.getHeaders();
    const InsertToOrder = {
      CusId: CusId,
      OrderStamp: OrderStamp,
      Cost: Cost,
      ModeOfPayment: ModeOfPayment
    };
    return this.http.post<ApiResponseMessage<string>>(`${this.baseApiUrl}api/OrderStatus/InsertOrderStatus`, InsertToOrder, { headers })
      .pipe(catchError(this.handleError));
  }

  insertTempToNotTemp(cusId: number, trayTempId: string, orderStamp: string, cost: number, modeOfPayment: number, items: any[]): Observable<any> {
    const headers = this.getHeaders();
    const InsertData = {   
      orderStamp: orderStamp,
      cost: cost,
      modeOfPayment: modeOfPayment,
      items: items
    };
    return this.http.post<any>(`${this.baseApiUrl}api/TrayItem/InsertTray?cusId=${cusId}&trayTempId=${trayTempId}`, InsertData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateMenu(itemId: number, newStock: number ) {
    const headers = this.getHeaders();
    return this.http.put<ApiResponseMessage<Menu[]>>(`${this.baseApiUrl}api/Item/UpdateItemById?itemId=${itemId}&newStock=${newStock}`, { headers })
      .pipe(catchError(this.handleError));
  }

  insertData(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseApiUrl}api/TrayItem/AddToTrayTest`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  updateTrayItemQuantity(trayTempId: number, quantity: number): Observable<ApiResponseMessage<string>> {
    const headers = this.getHeaders();
    const url = `${this.baseApiUrl}api/TrayItem/UpdateTrayItemQuantity`; 
    const updateData = {
      TrayItemTempId: trayTempId,
      NewQuantity: quantity
    };
    return this.http.post<ApiResponseMessage<string>>(url, updateData, { headers })
      .pipe(catchError(this.handleError));
  }

  getAllMOP(): Observable<ApiResponseMessage<MOP[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<MOP[]>>(`${this.baseApiUrl}api/ModeOfPayment/GetAllMOP`, { headers })
      .pipe(catchError(this.handleError));
  }
  
  generateTrayTempId(cusId: string): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post<string>(`${this.baseApiUrl}api/TrayItem/AddTrayTempId`, { cusId }, { headers })
      .pipe(catchError(this.handleError));
  }
}
