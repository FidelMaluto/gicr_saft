import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Serviço responsável pela comunicação com a rota /users do back-end.
 * Endpoints REST assumidos:
 *   GET    /users
 *   GET    /users/:id
 *   POST   /users
 *   PUT    /users/:id
 *   DELETE /users/:id
 *   POST   /users/login   (autenticação)
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  /** Lista todos os utilizadores do sistema */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /** Obtém um utilizador pelo ID */
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /** Cria um novo utilizador */
  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /** Atualiza um utilizador existente */
  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /** Elimina um utilizador */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Autentica o utilizador com email e password.
   *
   * NOTA IMPORTANTE: assume-se que routes/users.js expõe um endpoint
   * POST /users/login que recebe { email, password } e devolve o objeto
   * User (idealmente sem o campo password) quando as credenciais são válidas,
   * ou um erro HTTP (401/400) quando são inválidas.
   *
   * Se a tua rota de login tiver outro caminho (ex.: POST /login na raiz),
   * ajusta apenas a URL abaixo — nenhum componente precisa de ser alterado.
   */
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }
}
