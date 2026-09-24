/* Modelo de dados do Utilizador.
  Corresponde exatamente à tabela `utilizadores` (controllers/user.js).
 
  NOTA: o back-end guarda a password já cifrada no campo `senhaCifrada`
  (o controller não faz o hash — ver auth.service.ts / user.service.ts
  no front-end, que usa bcryptjs para cifrar antes de enviar).
 */
export interface User {
  id?: number;
  nome: string;
  email: string;
  senhaCifrada?: string;
  cargo: string;   
}
