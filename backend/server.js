// Responsável por chamar as rotas e a porta a escutar...
const path = require('path');

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

import app from './app.js';

const PORT = process.env.PORT || 3000;

console.log('DB_USER: ', process.env.DB_USER);
console.log('DB_PASSWORD: ', process.env.DB_PASSWORD);

app.listem(PORT, () => {
    console.log(`App rodando em: http://localhost:${PORT}`);
});
