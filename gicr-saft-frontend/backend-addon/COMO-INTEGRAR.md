# Como integrar a rota de Login no teu back-end

Isto é a ÚNICA alteração necessária no teu back-end para o front-end funcionar
por completo (conforme pedido). São 4 passos pequenos:

## 1. Copiar os ficheiros
Copia:
- `controllers/auth.js` → para a tua pasta `backend/controllers/`
- `routes/auth.js` → para a tua pasta `backend/routes/`

## 2. Registar a rota em `app.js`
Abre `backend/app.js` e adiciona a importação e o `app.use`, junto às restantes:

```javascript
import customers from './routes/customers.js';
import itemSales from './routes/itemSales.js';
import products from './routes/products.js';
import sales from './routes/sales.js';
import users from './routes/users.js';
import auth from './routes/auth.js';   // <-- ADICIONAR

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', customers);
app.use('/', itemSales);
app.use('/', products);
app.use('/', sales);
app.use('/', users);
app.use('/', auth);   // <-- ADICIONAR
```

## 3. Adicionar o JWT_SECRET ao `.env`
Abre o teu ficheiro `.env` (o mesmo onde já estão DB_HOST, DB_USER, etc.) e acrescenta:

```
JWT_SECRET=troca-isto-por-uma-string-longa-e-aleatoria-so-tua
```

Gera uma chave forte com, por exemplo:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 4. Confirmar que o campo `senhaCifrada` está mesmo cifrado
O controller `CreateUser`/`EditUser` (que já tens) grava diretamente o que
recebe no campo `senhaCifrada` — não faz hash. O front-end que preparei já
cifra a password com `bcryptjs` **antes** de enviar (ver
`frontend/src/app/services/user.service.ts`), por isso, desde que crie os
utilizadores sempre pelo próprio front-end, o campo já fica corretamente
cifrado com bcrypt e o `Login` consegue validar com `bcrypt.compare()`.

Se já tiveres utilizadores na tabela `utilizadores` com passwords em texto
simples (criados manualmente na base de dados, por exemplo), o login vai
falhar para esses até os recriares/editares pelo ecrã de Utilizadores do
front-end (ou cifrares manualmente com bcrypt antes de os inserir).

## 5. Reiniciar o back-end
```bash
node server.js
```

Testa com uma ferramenta como Postman/Insomnia:
```
POST http://localhost:3000/Login
Content-Type: application/json

{ "email": "admin@teuemail.com", "password": "a-tua-password" }
```
Deves receber `{ "token": "...", "user": { ... } }`.

## Nota sobre o `jsonwebtoken` e `bcryptjs`
Ambos já constam do teu `package.json` como dependências (`jsonwebtoken` e
`bcryptjs`) — não precisas de instalar mais nada, só correr `npm install`
se ainda não o tiveres feito depois de copiares os ficheiros.
