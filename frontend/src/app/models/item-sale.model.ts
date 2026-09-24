/* Modelo de dados de um Item de Venda.
  Corresponde exatamente à tabela `itens_venda` (controllers/itemSale.js).
 
  productName e subtotal existem apenas no front-end (não são persistidos)
  — servem para exibir o carrinho de compras no PDV e nos relatórios.
 */
export interface ItemSale {
  id?: number;
  vendaID?: number;        
  produtoID: number;
  quantidade: number;
  precoUnitario: number;
  productName?: string;      
  subtotal?: number;         
}
