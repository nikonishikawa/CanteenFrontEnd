import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Menu } from '../models/menu.model';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { Customer } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAllMenu(): Observable<Menu[]> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Menu[]>(`${this.baseApiUrl}api/Item/GetAllItem`, { headers });
  }

  getItemsByTrayTempId(trayTempId: number): Observable<any> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseApiUrl}api/TrayItem/tray/${trayTempId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching tray items by trayTempId:', error);
        return throwError('Error fetching tray items by trayTempId. Please try again later.');
      })
    );
  }

  GetTraytempId(cusId: number): Observable<any> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseApiUrl}api/TrayItem/GetTrayTempId/${cusId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching tray items by trayTempId:', error);
        return throwError('Error fetching tray items by trayTempId. Please try again later.');
      })
    );
  }

  addMenu(addMenuRequest: Menu): Observable<Menu> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Menu>(`${this.baseApiUrl}api/Item/InsertItem`, addMenuRequest, { headers });
  }

  insertTempToNotTemp(data: any): Observable<any> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseApiUrl}api/TrayItem/InsertTrayTemp`, data, { headers });
  }

  insertData(data: any): Observable<any> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseApiUrl}api/TrayItem/AddToTrayTest`, data, { headers });
  }

  updateTrayItemQuantity(trayTempId: number, quantity: number): Observable<ApiResponseMessage<string>> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }
  
    const token = localStorage.getItem('loginToken');
  
    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const url = `${this.baseApiUrl}api/TrayItem/UpdateTrayItemQuantity`; 
    const updateData = {
      TrayItemTempId: trayTempId,
      NewQuantity: quantity
    };
  
    return this.http.post<ApiResponseMessage<string>>(url, updateData, { headers });
  }
  
  generateTrayTempId(cusId: string): Observable<string> {
    if (typeof localStorage === 'undefined') {
      return throwError('');
    }

    const token = localStorage.getItem('loginToken');

    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<string>(`${this.baseApiUrl}api/TrayItem/AddTrayTempId`, { cusId }, { headers })
      .pipe(
        catchError(error => {
          console.error('Error generating TrayTempId:', error);
          return throwError(error);
        })
      );
  }
}
