import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

const STORAGE_KEY = 'auth_user';

/**
 * Serviço responsável por gerir a sessão do utilizador autenticado no browser.
 *
 * Simplificação assumida: como o back-end fornecido ainda não expõe emissão
 * de token JWT, guardamos apenas o utilizador (sem password) em
 * sessionStorage, para que a sessão termine ao fechar o separador/browser.
 *
 * Se o back-end passar a devolver um token JWT no login, este é o único
 * ficheiro que precisa de ser adaptado (guardar o token e enviá-lo num
 * interceptor HTTP como Authorization: Bearer <token>).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  /** Guarda o utilizador autenticado após um login bem-sucedido */
  setCurrentUser(user: User): void {
    const { senhaCifrada, ...safeUser } = user; // nunca persistir a password no cliente
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  }

  /** Devolve o utilizador atualmente autenticado, ou null se não houver sessão */
  getCurrentUser(): User | null {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Indica se existe uma sessão ativa */
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  /** Termina a sessão e redireciona para o ecrã de login */
  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}
