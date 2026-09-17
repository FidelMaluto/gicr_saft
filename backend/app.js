// Chamando e executando o arquivo server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const app = express();

// Importação das Rotas

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/');
app.use('/');
app.use('/');
app.use('/');

export default app;
