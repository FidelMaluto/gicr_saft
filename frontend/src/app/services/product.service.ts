import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Serviço responsável pela comunicação com a rota /products do back-end.
 * Endpoints REST assumidos:
 *   GET    /products
 *   GET    /products/:id
 *   POST   /products
 *   PUT    /products/:id
 *   DELETE /products/:id
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  /** Lista todos os produtos do inventário */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /** Obtém um produto pelo ID */
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /** Regista um novo produto no inventário */
  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /** Atualiza um produto existente (ex.: preço, stock) */
  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /** Remove um produto do inventário */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
