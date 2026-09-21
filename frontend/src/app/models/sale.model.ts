import { ItemSale } from './item-sale.model';

/**
 * Modelo de dados da Venda.
 * Corresponde à tabela/coleção "sales" no back-end.
 *
 * Regra de negócio (Angola):
 *  - total_bruto  = soma de (quantidade * preço unitário) de todos os itens
 *  - iva          = total_bruto * 0.14  (taxa de IVA de 14%)
 *  - total_liquido = total_bruto + iva
 */
export interface Sale {
  id?: number;
  customer_id: number;
  date?: string;          // Definido pelo back-end (ou opcionalmente enviado pelo front)
  total_bruto: number;
  iva: number;
  total_liquido: number;
  items: ItemSale[];
}
