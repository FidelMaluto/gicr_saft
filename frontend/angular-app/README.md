# Front-end Angular — Gestão de Inventário e Vendas

Estes ficheiros seguem a estrutura padrão de um projeto Angular (CLI).
Para integrar no teu projeto:

## 1. Criar o projeto (se ainda não o tiveres)
```bash
ng new inventario-frontend --routing=false --style=css
cd inventario-frontend
```
> Usamos `--routing=false` porque o `app-routing.module.ts` já vem incluído aqui.

## 2. Instalar o Bootstrap
```bash
npm install bootstrap
```

No ficheiro `angular.json`, dentro de `projects.<nome-do-projeto>.architect.build.options`, adiciona:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```
> O `bootstrap.bundle.min.js` é necessário para o funcionamento dos Modais (usados no componente de Produtos).

## 3. Copiar os ficheiros
Copia todo o conteúdo da pasta `src/app/` fornecida para dentro do `src/app/` do teu projeto, substituindo `app.module.ts`, `app-routing.module.ts`, `app.component.ts` e `app.component.html`.

Estrutura final esperada:
```
src/app/
├── app-routing.module.ts
├── app.component.css
├── app.component.html
├── app.component.ts
├── app.module.ts
├── components/
│   ├── customers/
│   │   ├── customers.component.css
│   │   ├── customers.component.html
│   │   └── customers.component.ts
│   ├── login/
│   │   ├── login.component.css
│   │   ├── login.component.html
│   │   └── login.component.ts
│   ├── products/
│   │   ├── products.component.css
│   │   ├── products.component.html
│   │   └── products.component.ts
│   ├── sales/
│   │   ├── sales.component.css
│   │   ├── sales.component.html
│   │   └── sales.component.ts
│   └── users/
│       ├── users.component.css
│       ├── users.component.html
│       └── users.component.ts
├── guards/
│   └── auth.guard.ts
├── models/
│   ├── customer.model.ts
│   ├── item-sale.model.ts
│   ├── product.model.ts
│   ├── sale.model.ts
│   └── user.model.ts
└── services/
    ├── auth.service.ts
    ├── customer.service.ts
    ├── product.service.ts
    ├── sale.service.ts
    └── user.service.ts
```

## Login e Gestão de Utilizadores

- **`UserService.login(email, password)`** assume um endpoint `POST /users/login` que recebe `{ email, password }` e devolve o objeto `User` (idealmente sem a `password`) quando as credenciais são válidas. Se a tua rota de login for diferente (ex.: `POST /login` na raiz), ajusta apenas a URL em `services/user.service.ts` — nenhum componente precisa de mudar.
- **`AuthService`** guarda o utilizador autenticado em `sessionStorage` (sem password) e expõe `isLoggedIn()`, `getCurrentUser()` e `logout()`. A sessão termina ao fechar o separador do browser — é uma solução simples adequada enquanto o back-end não emite tokens JWT.
- **`AuthGuard`** protege as rotas `/sales`, `/products`, `/customers` e `/users`, redirecionando para `/login` sempre que não houver sessão iniciada.
- A navbar em `app.component.html` só é apresentada quando existe sessão ativa, e inclui o nome do utilizador autenticado e o botão "Sair".

### Evoluir para autenticação com JWT (recomendado em produção)
Quando o back-end passar a devolver um token no login, basta:
1. Guardar o token em `AuthService` (em vez de/além do utilizador).
2. Criar um `HttpInterceptor` que adicione o cabeçalho `Authorization: Bearer <token>` a todos os pedidos.
3. Adicionar esse interceptor ao array `providers` do `app.module.ts`.

## 4. Correr o back-end e o front-end
```bash
# No back-end (porta 3000)
node app.js

# No front-end
ng serve -o
```

## Notas importantes

- **CORS**: o teu back-end já usa `cors()`, por isso as chamadas de `http://localhost:4200` para `http://localhost:3000` funcionarão sem configuração adicional.
- **Endpoints assumidos**: os serviços assumem rotas REST convencionais (`GET/POST/PUT/DELETE` em `/customers`, `/products` e `/sales`). Se os teus routers (`customers.js`, `products.js`, `sales.js`) usarem nomes de campos ou caminhos diferentes, ajusta apenas dentro de `services/*.service.ts` — os componentes não precisam de mudar.
- **itemSales**: no PDV, os itens do carrinho são enviados dentro do próprio objeto `Sale.items[]` para `/sales` — cabe à tua rota de vendas no back-end persistir cada item na coleção/tabela `itemSales` e atualizar o stock dos produtos. Se preferires que o front-end envie os itens separadamente para `/itemSales`, cria um `ItemSaleService` seguindo o mesmo padrão dos outros serviços.
- **IVA**: a taxa de 14% está centralizada na constante `IVA_RATE` em `sales.component.ts`, facilitando alterações futuras.
