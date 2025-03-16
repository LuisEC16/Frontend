import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'https://24d5e993-b25d-4149-95e6-046b20fdf9e6.mock.pstmn.io/transactions';

  constructor(private http: HttpClient) {}
  
  maskTransactionId(id: string): string {
    return `${id.substring(0, 4)}****${id.slice(-4)}`;
  }
  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'Completado',
      'in_process': 'En proceso',
      'rejected': 'Rechazado',
      'ready_to_be_checked': 'Listo para ser verificado'
    };
    return statusMap[status] || 'Desconocido';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    // Extrae día, mes, año, horas y minutos
    const day = String(date.getDate()).padStart(2, '0'); // Día (2 dígitos)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (2 dígitos)
    const year = date.getFullYear(); // Año (4 dígitos)
    const hours = String(date.getHours()).padStart(2, '0'); // Horas (2 dígitos)
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos (2 dígitos)
  
    // Formato: DD/MM/AAAA hh:mm
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response: any) => {
        return response.map((tx: any) => ({
          id: this.maskTransactionId(tx.id),
          createdAt: this.formatDate(tx.createdAt),
          status: this.translateStatus(tx.status),
          paymentMethod: tx.paymentMethod,
          student: `${tx.user.firstName} ${tx.user.lastName}`,
          course: tx.course.name,
          amount: `$${tx.course.price}`,
          validatedBy: tx.validatedBy ? `${tx.validatedBy.firstName} ${tx.validatedBy.lastName}` : 'No validado'
        }));
      })
    );
  }
}