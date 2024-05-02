import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Login, LoginResponse } from '../models/login.model';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  SignIn(LoginUser: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseApiUrl + 'api/UserCredential/LoginAccount', LoginUser);
  }
  

  
}
