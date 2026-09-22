/**
 * Modelo de dados do Cliente.
 * Corresponde à tabela/coleção "customers" no back-end (Node.js + Express).
 */
export interface Customer {
  id?: number;
  nome: string;      // Nome do cliente
  nif: string;        // Número de Identificação Fiscal (obrigatório em Angola)
  telefone?: string;
  email?: string;
}
