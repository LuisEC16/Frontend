import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'https://93e6430e-63e5-4bd1-bd69-b804a95fc13e.mock.pstmn.io/course';

  constructor(private http: HttpClient) {}

  getCancelledCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}