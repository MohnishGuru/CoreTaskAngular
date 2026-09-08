import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl = 'http://localhost:5146/api/Tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }


 createTask(taskData: any): Observable<any> {
    // FIX: C# will reject an empty string for a Guid. Give it a default!
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'AAD1D453-9D76-4D75-BBA3-2522C871C0A7'; 
    }

    const headers = new HttpHeaders().set('X-User-Id', userId);
    console.log('Sending Task Data:', taskData);

    return this.http.post<any>(this.apiUrl, taskData, { headers });
  }


  updateTask(taskId: string, taskData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${taskId}`, taskData);
  }
}