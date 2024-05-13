import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { CategoryDto } from '../models/manage-category.model';

@Injectable({
  providedIn: 'root'
})
export class ManageCategoryService {

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

  getAllCategory(): Observable<ApiResponseMessage<CategoryDto[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<CategoryDto[]>>(`${this.baseApiUrl}api/Category/GetAllCategory`, { headers })
      .pipe(catchError(this.handleError));
  }

  addCategory(AddCategory: CategoryDto): Observable<ApiResponseMessage<CategoryDto[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<CategoryDto[]>>(`${this.baseApiUrl}api/Category/InsertCategory`,  AddCategory);
  }

  editCategory(UpdateCategory: CategoryDto): Observable<ApiResponseMessage<CategoryDto[]>> {
    const headers = this.getHeaders();
    return this.http.put<ApiResponseMessage<CategoryDto[]>>(`${this.baseApiUrl}api/Category/UpdateCategory`,  UpdateCategory);
  }

  
  deleteCategory(categoryId: number): Observable<ApiResponseMessage<CategoryDto>> {
    const headers = new HttpHeaders(); 
    return this.http.delete<ApiResponseMessage<CategoryDto>>(`${this.baseApiUrl}api/Category/DeleteCategory/${categoryId}`, { headers });
  }
}
