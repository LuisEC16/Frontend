import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageuserService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  // Obtener usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear usuario
  createUser(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar contraseña de usuario
  updateUserPassword(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/update-password`, data);
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}