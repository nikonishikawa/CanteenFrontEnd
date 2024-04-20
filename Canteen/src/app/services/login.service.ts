import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { ApiResponseMessage } from '../models/apiresponsemessage.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  SignIn(LoginUser: Login): Observable<ApiResponseMessage<Login>> {
    return this.http.post<ApiResponseMessage<Login>>(this.baseApiUrl + 'api/UserCredential/LoginAccount', LoginUser);
  }
}
