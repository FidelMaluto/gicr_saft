import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

/**
 * Comunicação com routes/customers.js:
 *   GET    /Clientes
 *   POST   /Cliente
 *   PUT    /Cliente/:id
 *   DELETE /Cliente/:id
 */
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/Clientes`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/Cliente`, customer);
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/Cliente/${id}`, customer);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Cliente/${id}`);
  }
}
