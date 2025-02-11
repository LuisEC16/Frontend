import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'https://242958c8-afe8-4e7c-aab9-396d31309341.mock.pstmn.io//api/transactions'; // 📌 Mock API de Postman

  constructor(private http: HttpClient) {}

  // 🔹 Obtener transacciones con filtros aplicados
  getFilteredTransactions(filters: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters.date) params = params.set('date', filters.date);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.method) params = params.set('method', filters.method);

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // 🔹 Obtener detalles de una transacción específica
  getTransactionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Validar una transacción (asociándola a un operador)
  validateTransaction(id: number, operatorId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/validate`, { validated_by: operatorId });
  }

  // 🔹 Eliminar una transacción
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
