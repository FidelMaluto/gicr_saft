import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';

/**
 * Comunicação com routes/sales.js:
 *   GET    /Vendas
 *   POST   /Venda   (cria APENAS o cabeçalho da venda — os itens vão
 *                     separadamente para /ItensVenda, ver ItemSaleService)
 *   PUT    /Venda/:id
 *   DELETE /Venda/:id
 */
@Injectable({ providedIn: 'root' })
export class SaleService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Vendas`);
  }

  create(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/Venda`, sale);
  }

  update(id: number, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/Venda/${id}`, sale);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Venda/${id}`);
  }
}
