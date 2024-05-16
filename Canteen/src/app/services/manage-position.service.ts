import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { PositionDto } from '../models/manage-catalog.model';

@Injectable({
  providedIn: 'root'
})
export class ManagePositionService {
  
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

  getAllPosition(): Observable<ApiResponseMessage<PositionDto[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<PositionDto[]>>(`${this.baseApiUrl}api/Position/GetAllPosition`, { headers })
      .pipe(catchError(this.handleError));
  }

  addPosition(PositionCategory: PositionDto): Observable<ApiResponseMessage<PositionDto[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<PositionDto[]>>(`${this.baseApiUrl}api/Position/InsertPosition`,  PositionCategory);
  }

  editPosition(UpdatePosition: PositionDto): Observable<ApiResponseMessage<PositionDto[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<PositionDto[]>>(`${this.baseApiUrl}api/Position/UpdatePosition`,  UpdatePosition);
  }

  deletePosition(positionId: number): Observable<ApiResponseMessage<PositionDto>> {
    const headers = new HttpHeaders(); 
    return this.http.delete<ApiResponseMessage<PositionDto>>(`${this.baseApiUrl}api/Position/DeletePosition/${positionId}`, { headers });
  }
}
