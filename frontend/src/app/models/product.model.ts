/**
 * Modelo de dados do Produto (item de inventário).
 * Corresponde à tabela/coleção "products" no back-end.
 */
export interface Product {
  id?: number;
  name: string;         // Nome/descrição curta do produto
  price: number;         // Preço unitário (Kz) sem IVA
  stock: number;         // Quantidade disponível em inventário
  description?: string;  // Descrição detalhada (opcional)
}
