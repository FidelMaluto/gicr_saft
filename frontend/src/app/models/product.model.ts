/**
 * Modelo de dados do Produto.
 * Corresponde exatamente à tabela `produtos` (controllers/product.js).
 */
export interface Product {
  id?: number;
  nome: string;
  codigoBarra?: string;
  precoVenda: number;     
  stockAtual: number;
  stockMinimo: number;
  precoCusto: number;
  regimeIVA: string;      
  estado: string;      
}
