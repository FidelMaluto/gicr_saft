import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticatedUser, LoginRequest, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/* Serviço de autenticação.
 
  Consome o endpoint POST /Login que precisa de ser acrescentado ao
  back-end (código pronto na pasta backend-addon/ deste pacote).
  Guarda o token JWT e o utilizador em localStorage, e expõe helpers
  usados pelo AuthGuard e pelo AuthInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, body).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): AuthenticatedUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Verifica se existe um token guardado e se ainda não expirou (lê o payload JWT sem validar assinatura) */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }
}
