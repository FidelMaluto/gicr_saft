# Front-end — Sistema de Gestão de Inventário e Vendas (Angular + Bootstrap)

Front-end completo, gerado e **compilado com sucesso** (`ng build`) 

- Login com JWT (requer a rota adicionada no pacote)
- Ponto de Venda (PDV) com cálculo automático de IVA (14%)
- Gestão de Produtos, Clientes e Utilizadores
- Relatório SAF-T (simplificado) em PDF, por período

## 1. Instalar dependências
```bash
cd frontend
npm install
```

## 2. Correr os dois lados
```bash
# Terminal 1 — back-end
cd backend
node server.js

# Terminal 2 — front-end
cd frontend
ng serve -o
```

A aplicação abre em `http://localhost:4200` e redireciona para `/login`.

## Estrutura do projeto

```
src/app/
├── app-routing.module.ts
├── app.component.ts / .html / .css
├── app.module.ts
├── components/
│   ├── login/          → Autenticação (POST /Login)
│   ├── sales/           → PDV (POST /Venda + /ItensVenda + PUT /Produto stock)
│   ├── products/        → CRUD de Produtos (/Produtos, /Produto)
│   ├── customers/        → CRUD de Clientes (/Clientes, /Cliente)
│   ├── users/            → CRUD de Utilizadores (/Utilizadores, /Utilizador)
│   └── reports/           → Relatório SAF-T em PDF
├── guards/
│   └── auth.guard.ts      → Protege todas as rotas exceto /login
├── interceptors/
│   └── auth.interceptor.ts → Anexa "Authorization: Bearer <token>" aos pedidos
├── models/                 → Interfaces alinhadas 1:1 com as tabelas MySQL
└── services/
    ├── auth.service.ts      → Login, sessão (localStorage), logout
    ├── customer.service.ts
    ├── product.service.ts
    ├── sale.service.ts
    ├── item-sale.service.ts
    ├── user.service.ts       → Cifra a password com bcryptjs antes de enviar
    └── saft-report.service.ts → Gera o PDF do relatório (jsPDF + autoTable)
```

### Rotas
| Recurso    | GET            | POST          | PUT                | DELETE             |
|------------|----------------|---------------|---------------------|---------------------|
| Clientes   | `/Clientes`    | `/Cliente`    | `/Cliente/:id`       | `/Cliente/:id`       |
| Produtos   | `/Produtos`    | `/Produto`    | `/Produto/:id`       | `/Produto/:id`       |
| Vendas     | `/Vendas`      | `/Venda`      | `/Venda/:id`         | `/Venda/:id`         |
| Itens Venda| `/ItensVenda`  | `/ItensVenda` | `/ItensVenda/:id`    | `/ItensVenda/:id`    |
| Utilizadores| `/Utilizadores`| `/Utilizador`| `/Utilizador/:id`    | `/Utilizador/:id`    |
| Login (novo)| —             | `/Login`      | —                    | —                    |

### Finalizar uma venda é 3 pedidos em sequência
1. `POST /Venda` → cria o cabeçalho, obtém o `id`
2. `POST /ItensVenda` (um por produto no carrinho)
3. `PUT /Produto/:id` (um por produto, com `stockAtual` decrementado)

**Isto não é atómico** (o Express/MySQL2 aqui não usa transações). Se o
passo 2 ou 3 falhar a meio, a venda pode ficar parcialmente registada — o
ecrã avisa nesse caso. Para produção, o ideal é mover esta lógica para uma
única rota no back-end com uma transação SQL (`START TRANSACTION` /
`COMMIT` / `ROLLBACK`).

### Relatório SAF-T em PDF
O botão "Gerar Relatório SAF-T (PDF)" (dentro de **Relatórios**) usa
`jsPDF` + `jspdf-autotable`, no browser, sem precisar de nada no
back-end. Cruza `/Vendas`, `/ItensVenda`, `/Clientes` e `/Produtos` do
período selecionado e gera um PDF com: cabeçalho da empresa, totais
(Bruto/IVA/Líquido), tabela de vendas e tabela detalhada de itens.

**Atenção:** isto é um relatório de auditoria em PDF, pensado para leitura
humana — **não é** o ficheiro XML oficial SAF-T-AO que a AGT exige para
submissão eletrónica. Gerar esse XML implicaria mapear o schema completo
definido pela Administração Geral Tributária angolana, o que é um projeto
à parte caso venho a precisar dele no futuro.

### Regime de IVA por produto
O campo `regimeIVA` (por produto) sugere que, no futuro, diferentes
produtos podem ter tratamentos fiscais diferentes (isentos, taxa reduzida,
etc.). Para manter o âmbito controlado, o cálculo de IVA no PDV e no
relatório usa, por agora, uma taxa única de 14% sobre o total — a mesma
regra usada em toda a aplicação.

## Validação
Este projeto foi gerado com `ng new --standalone=false` (Angular 19.2),
`npm install` executado e `ng build --configuration development`
