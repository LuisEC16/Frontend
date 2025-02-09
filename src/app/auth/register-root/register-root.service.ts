import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterRootService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Verifica si se necesita configurar un usuario root
  checkSetup(): Observable<{ needsSetup: boolean }> {
    return this.http.get<{ needsSetup: boolean }>(`${this.apiUrl}/setup`, { withCredentials: true });
  }

  // Crea el usuario root
  createRootUser(user: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/setup`, { user, password }, { withCredentials: true });
  }
}
