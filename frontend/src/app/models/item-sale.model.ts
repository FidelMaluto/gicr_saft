/**
 * Modelo de dados de um Item de Venda (linha do carrinho / detalhe da venda).
 * Corresponde à tabela/coleção "itemSales" no back-end.
 */
export interface ItemSale {
  id?: number;
  sale_id?: number;       // Preenchido pelo back-end após a venda ser criada
  product_id: number;      // FK para o produto vendido
  product_name?: string;   // Usado apenas no front-end para exibição no carrinho
  quantity: number;        // Quantidade vendida
  unit_price: number;      // Preço unitário no momento da venda
  subtotal: number;        // quantity * unit_price
}
