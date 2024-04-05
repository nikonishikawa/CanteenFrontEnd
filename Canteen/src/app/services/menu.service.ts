import { HttpClient } from '@angular/common/http';
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

  // getAllMenu(): Observable<ApiResponseMessage<Menu[]>> {
  //   return this.http.get<ApiResponseMessage<Menu[]>>(this.baseApiUrl + 'api/Item/GetAllItem')
  //     .pipe(
  //       catchError(error => {
  //         // Handle error here
  //         console.error('An error occurred:', error);
  //         return throwError(error); // Rethrow the error
  //       })
  //     );
  // }

  getAllMenu(): Observable<Menu[]> {
      return this.http.get<Menu[]>(this.baseApiUrl + 'api/Item/GetAllItem');
        // .pipe(
        //   catchError(error => {
        //     // Handle error here
        //     console.error('An error occurred:', error);
        //     return throwError(error); // Rethrow the error
        //   })
        // );
    }
}