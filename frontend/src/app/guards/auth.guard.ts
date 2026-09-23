import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege as rotas privadas (PDV, Produtos, Clientes, Utilizadores,
 * Relatórios), redirecionando para /login quando não há sessão válida.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
