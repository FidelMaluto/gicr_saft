// Chamando e executando o arquivo server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Importação das Rotas
import customers from './routes/customers.js';
import itemSales from './routes/itemSales.js';
import products from './routes/products.js';
import sales from './routes/sales.js';
import users from './routes/users.js';
import auth from './routes/auth.js'; 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/', customers);
app.use('/', itemSales);
app.use('/', products);
app.use('/', sales);
app.use('/', users);
app.use('/', auth);

export default app;
