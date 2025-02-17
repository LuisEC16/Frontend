import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'https://2ed8567d-7a1c-4b1b-bab9-4ed2dfadeb79.mock.pstmn.io/api/transactions'; // 📌 Mock API de Postman

  constructor(private http: HttpClient) {}

  // Obtener todas las transacciones
  getTransactions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }  

  // Obtener una transacción por ID
  getTransactionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
