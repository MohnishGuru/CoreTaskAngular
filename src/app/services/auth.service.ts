import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

apiUrl: string = 'http://localhost:5146/api/Auth';

  constructor(private http:HttpClient) { }

  login(data:Login):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/login`,data);
  }
 forgotPassword(email: string) {
  return this.http.post(`${this.apiUrl}/Auth/forgot-password?email=${email}`, {});
}
getProfile(userId: string) {
  return this.http.get(`${this.apiUrl}/Auth/profile/${userId}`);
}
  logout()
  {
    localStorage.clear();
  }
}