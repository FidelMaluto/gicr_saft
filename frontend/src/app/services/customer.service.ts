import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

/**
 * Serviço responsável pela comunicação com a rota /customers do back-end.
 * Assume-se que o Express expõe os endpoints REST convencionais:
 *   GET    /customers
 *   GET    /customers/:id
 *   POST   /customers
 *   PUT    /customers/:id
 *   DELETE /customers/:id
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  /** Lista todos os clientes */
  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  /** Obtém um cliente pelo ID */
  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  /** Cria um novo cliente */
  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  /** Atualiza um cliente existente */
  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  /** Elimina um cliente */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
