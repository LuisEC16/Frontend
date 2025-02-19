import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  updatePassword(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/update-password`, data);
  }
  

}
