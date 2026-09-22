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
  formaPagamento?: string;
  clienteID?: number;          // Definido pelo back-end (ou opcionalmente enviado pelo front)
  totalVenda: number;
  valorIVA: number;
  utilizadorID: number;
  dataVenda?: string;
  totalLiquido: number;
}
