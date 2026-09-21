import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';

/**
 * Serviço responsável pela comunicação com a rota /sales do back-end.
 * O objeto Sale enviado no create() já vem com os totais calculados
 * (total_bruto, iva, total_liquido) e o array de items — cabe ao
 * back-end persistir a venda e os respetivos itemSales, além de
 * atualizar o stock dos produtos envolvidos.
 *
 * Endpoints REST assumidos:
 *   GET  /sales
 *   GET  /sales/:id
 *   POST /sales
 */
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) {}

  /** Lista o histórico de vendas */
  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  /** Obtém o detalhe de uma venda pelo ID */
  getById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  /** Regista/finaliza uma nova venda (envia cabeçalho + itens) */
  create(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, sale);
  }
}
