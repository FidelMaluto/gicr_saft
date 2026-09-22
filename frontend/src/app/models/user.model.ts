/**
 * Modelo de dados do Utilizador (operador do sistema).
 * Corresponde à tabela/coleção "users" no back-end.
 */
export interface User {
  id?: number;
  nome: string;
  email: string;
  senhaCifrada?: string;  // Nunca deve ser exposto/guardado no front-end após login
  cargo?: string;       // Ex.: 'admin', 'vendedor'
}
