import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de rota que impede o acesso a páginas protegidas (PDV, Produtos,
 * Clientes, Utilizadores) sem sessão iniciada. Redireciona para /login
 * quando não há utilizador autenticado.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
