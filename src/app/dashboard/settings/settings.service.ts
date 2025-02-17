import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'https://tu-backend.com/api';

  constructor(private http: HttpClient) {}

  updatePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-password`, data);
  }

}
