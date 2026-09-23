/**
 * Modelo de dados da Venda (cabeçalho).
 * Corresponde exatamente à tabela `vendas` (controllers/sale.js).
 *
 * Regra de negócio (Angola):
 *  - totalVenda   = soma de (quantidade * precoUnitario) de todos os itens (Total Bruto)
 *  - valorIVA     = totalVenda * 0.14  (taxa de IVA de 14%)
 *  - totalLiquido = totalVenda + valorIVA
 */
export interface Sale {
  id?: number;
  formaPagamento: string;   // Ex.: 'Numerário', 'Multicaixa', 'Transferência'
  clienteID: number;
  totalVenda: number;        // Total Bruto
  valorIVA: number;
  utilizadorID: number;      // Utilizador autenticado que registou a venda
  dataVenda: string;         // formato 'YYYY-MM-DD HH:mm:ss'
  totalLiquido: number;
}
