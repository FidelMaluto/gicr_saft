/**
 * Modelo de dados de um Item de Venda (linha do carrinho / detalhe da venda).
 * Corresponde à tabela/coleção "itemSales" no back-end.
 */
export interface ItemSale {
  id?: number;
  vendaID?: number;       // Preenchido pelo back-end após a venda ser criada
  produtoID: number;  // Usado apenas no front-end para exibição no carrinho
  quantidade: number;        // Quantidade vendida
  precoUnitario: number;     // quantity * unit_price
}
