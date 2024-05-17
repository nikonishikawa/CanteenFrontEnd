import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';
import { MembershipDto } from '../models/manage-catalog.model';

@Injectable({
  providedIn: 'root'
})
export class ManageMembershipService {

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

  getAllMembership(): Observable<ApiResponseMessage<MembershipDto[]>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponseMessage<MembershipDto[]>>(`${this.baseApiUrl}api/Membership/GetAllMembership`, { headers })
      .pipe(catchError(this.handleError));
  }

  addMembership(AddMembership: MembershipDto): Observable<ApiResponseMessage<MembershipDto[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<MembershipDto[]>>(`${this.baseApiUrl}api/Membership/InsertMembership`,  AddMembership)
    .pipe(catchError(this.handleError));
  }

  editMembership(UpdateMembership: MembershipDto): Observable<ApiResponseMessage<MembershipDto[]>> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponseMessage<MembershipDto[]>>(`${this.baseApiUrl}api/Membership/UpdateMembership`,  UpdateMembership)
    .pipe(catchError(this.handleError));
  }

  deleteMembership(membershipId: number): Observable<ApiResponseMessage<MembershipDto>> {
    const headers = new HttpHeaders(); 
    return this.http.delete<ApiResponseMessage<MembershipDto>>(`${this.baseApiUrl}api/Membership/DeleteMembership/${membershipId}`, { headers })
    .pipe(catchError(this.handleError));
  }
}
