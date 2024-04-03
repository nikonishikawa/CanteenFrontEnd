import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Register } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  RegisterIn(RegisterUser: Register): Observable<Register> {
    return this.http.post<Register>(this.baseApiUrl + 'api/UserCredential/RegisterUser', RegisterUser);
  }

}
