/**
 * Modelo de dados do Produto (item de inventário).
 * Corresponde à tabela/coleção "products" no back-end.
 */
export interface Product {
  id?: number;
  nome: string;         // Nome/descrição curta do produto
  codigoBarra: number;         // Preço unitário (Kz) sem IVA
  precoVenda: number;         // Quantidade disponível em inventário
  stockAtual: number;  // Descrição detalhada (opcional)
  stockMinimo: number;
  precoCusto: number;
  regimeIVA: number;
  estado?: string;
}
