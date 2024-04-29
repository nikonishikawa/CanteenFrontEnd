import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  
  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  getAllTransaction(cusId: number): Observable<any>  {
    const url = `${this.baseApiUrl}api/OrderStatus/GetOrderStatusWithStatus/${cusId}`;
    return this.http.get<any[]>(url);
  }

  FilterTransaction(status: string): Observable<any> {
    const url = `${this.baseApiUrl}api/transactions/filter?status=${status}`;
    return this.http.get<any>(url);
  }
  

  SearchTransactionId(id: string): Observable<any> {
    const url = `${this.baseApiUrl}api/transactions/search?id=${id}`;
    return this.http.get<any>(url);
  }

}
