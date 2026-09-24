/* Modelo de dados da Venda (cabeçalho).
  Corresponde exatamente à tabela `vendas` (controllers/sale.js).
 
  Regra de negócio (Angola):
   - totalVenda   = soma de (quantidade * precoUnitario) de todos os itens (Total Bruto)
   - valorIVA     = totalVenda * 0.14  (taxa de IVA de 14%)
   - totalLiquido = totalVenda + valorIVA
 */
export interface Sale {
  id?: number;
  formaPagamento: string;  
  clienteID: number;
  totalVenda: number;        
  valorIVA: number;
  utilizadorID: number;     
  dataVenda: string;         
  totalLiquido: number;
}
