import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboard } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:5146/api/Dashboard';

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.apiUrl);
  }
}