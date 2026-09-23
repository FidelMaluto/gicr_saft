import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemSale } from '../models/item-sale.model';

/**
 * Comunicação com routes/itemSales.js:
 *   GET    /ItensVenda
 *   POST   /ItensVenda   (note o plural mesmo no POST — assim está definido
 *                          na tua rota, ao contrário de /Cliente, /Produto, etc.)
 *   PUT    /ItensVenda/:id
 *   DELETE /ItensVenda/:id
 */
@Injectable({ providedIn: 'root' })
export class ItemSaleService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ItemSale[]> {
    return this.http.get<ItemSale[]>(`${this.apiUrl}/ItensVenda`);
  }

  create(item: ItemSale): Observable<ItemSale> {
    return this.http.post<ItemSale>(`${this.apiUrl}/ItensVenda`, item);
  }

  update(id: number, item: ItemSale): Observable<ItemSale> {
    return this.http.put<ItemSale>(`${this.apiUrl}/ItensVenda/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ItensVenda/${id}`);
  }
}
