import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Anexa automaticamente o cabeçalho "Authorization: Bearer <token>"
 * a todos os pedidos HTTP, sempre que existir uma sessão iniciada.
 *
 * NOTA: as rotas atuais do back-end (Clientes, Produtos, Vendas, etc.)
 * ainda não validam este token — apenas /Login o emite. Quando
 * adicionares um middleware de autenticação no Express, este
 * interceptor já deixa tudo pronto do lado do front-end.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
