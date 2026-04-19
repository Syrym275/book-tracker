import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/movie.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth';
  private tokenKey = 'movielog_token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string, password_confirm: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, {
      username, email, password, password2: password_confirm
    }).pipe(tap(res => { if (res.token) this.saveAuth(res.token); }));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(tap(res => { if (res.token) this.saveAuth(res.token); }));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {}).pipe(tap(() => this.clearAuth()));
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  hasToken(): boolean { return !!this.getToken(); }

  private saveAuth(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true);
  }

  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
  }
}
