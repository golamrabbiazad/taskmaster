import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { catchError, last, tap, throwError } from 'rxjs';

interface TokenResponse {
  token: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.storageService.setToken(res.token);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          return throwError(
            () => new Error('Incorrect login, please try again.')
          );
        })
      );
  }

  register({ firstname, lastname, email, password, role }: RegisterRequest) {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/register`, {
        firstname,
        lastname,
        email,
        password,
        role,
      })
      .pipe(
        tap((res) => {
          this.storageService.setToken(res.token);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          console.log(err);

          return throwError(
            () => new Error('Something went wrong, please try again.')
          );
        })
      );
  }

  logout() {
    this.storageService.clearToken();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return Boolean(this.storageService.getToken());
  }
}
