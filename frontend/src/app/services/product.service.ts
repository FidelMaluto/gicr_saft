import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

/* Comunicação com routes/products.js:
    GET    /Produtos
    POST   /Produto
    PUT    /Produto/:id
    DELETE /Produto/:id
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Produtos`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/Produto`, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/Produto/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Produto/${id}`);
  }
}
