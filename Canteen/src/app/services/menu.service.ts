import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
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

    // Retrieve token from localStorage
    const token = localStorage.getItem('loginToken');

    // Check if token exists
    if (!token) {
        console.error('Token not found');
        return new Observable<Menu[]>(observer => {
            observer.error('Token not found');
        });
    }

    // Create headers with token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make HTTP GET request with headers
    return this.http.get<Menu[]>(`${this.baseApiUrl}api/Item/GetAllItem`, { headers });
}
  addMenu(addMenuRequest: Menu): Observable<Menu> {
    // Retrieve token from localStorage
    const token = localStorage.getItem('loginToken');

    // Check if token exists
    if (!token) {
      console.error('Token not found');
      return new Observable<Menu>(observer => {
        observer.error('Token not found');
      });
    }

    // Create headers with token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make HTTP POST request with headers
    return this.http.post<Menu>(`${this.baseApiUrl}api/Item/InsertItem`, addMenuRequest, { headers });
  }
}