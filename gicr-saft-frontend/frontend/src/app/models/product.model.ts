/**
 * Modelo de dados do Produto.
 * Corresponde exatamente à tabela `produtos` (controllers/product.js).
 */
export interface Product {
  id?: number;
  nome: string;
  codigoBarra?: string;
  precoVenda: number;     // Preço de venda ao público (sem IVA)
  stockAtual: number;
  stockMinimo: number;
  precoCusto: number;
  regimeIVA: string;      // Ex.: 'Regime Geral', 'Isento', 'Regime Simplificado'
  estado: string;         // Ex.: 'Ativo', 'Inativo'
}
