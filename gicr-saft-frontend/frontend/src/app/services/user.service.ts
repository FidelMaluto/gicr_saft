import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

/**
 * Comunicação com routes/users.js:
 *   GET    /Utilizadores
 *   POST   /Utilizador
 *   PUT    /Utilizador/:id
 *   DELETE /Utilizador/:id
 *
 * IMPORTANTE: o controller CreateUser/EditUser no back-end grava
 * diretamente o valor recebido no campo `senhaCifrada` — não faz o
 * hash. Por isso este serviço cifra a password no cliente com
 * bcryptjs antes de enviar, para nunca guardar texto simples na BD.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000';
  private readonly SALT_ROUNDS = 10;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/Utilizadores`);
  }

  /** Cria um utilizador, cifrando a password (recebida em texto simples) antes de enviar */
  async create(user: User, plainPassword: string): Promise<User> {
    const senhaCifrada = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    const payload: User = { ...user, senhaCifrada };
    return this.http.post<User>(`${this.apiUrl}/Utilizador`, payload).toPromise() as Promise<User>;
  }

  /**
   * Atualiza um utilizador. Se plainPassword for fornecida, cifra e substitui
   * a senha; caso contrário, mantém a senha atual (currentSenhaCifrada).
   */
  async update(id: number, user: User, plainPassword: string | null, currentSenhaCifrada: string): Promise<User> {
    const senhaCifrada = plainPassword
      ? await bcrypt.hash(plainPassword, this.SALT_ROUNDS)
      : currentSenhaCifrada;
    const payload: User = { ...user, senhaCifrada };
    return this.http.put<User>(`${this.apiUrl}/Utilizador/${id}`, payload).toPromise() as Promise<User>;
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Utilizador/${id}`);
  }
}
