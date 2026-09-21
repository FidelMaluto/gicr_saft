/**
 * Modelo de dados do Utilizador (operador do sistema).
 * Corresponde à tabela/coleção "users" no back-end.
 */
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;  // Nunca deve ser exposto/guardado no front-end após login
  role?: string;       // Ex.: 'admin', 'vendedor'
}
