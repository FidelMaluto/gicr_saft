/* Modelo de dados do Cliente.
  Corresponde exatamente à tabela `clientes` (controllers/customer.js).
 */
export interface Customer {
  id?: number;
  nome: string;
  nif: string;
  telefone?: string;
  email?: string;
}
