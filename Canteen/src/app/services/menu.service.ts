import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAllMenu(): Observable<Menu[]> {
    // Check if localStorage is available
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
}