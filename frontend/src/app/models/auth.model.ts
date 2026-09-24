/* Modelos relacionados com autenticação.
  Corresponde ao endpoint POST /Login que precisa de ser acrescentado
  ao back-end (ver pasta backend-addon/ neste mesmo pacote).
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}
