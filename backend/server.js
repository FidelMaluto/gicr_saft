// Responsável por chamar as rotas e a porta a escutar...
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import app from './app.js';

const PORT = process.env.PORT || 3000;

console.log('DB_USER: ', process.env.DB_USER);
console.log('DB_PASSWORD: ', process.env.DB_PASSWORD);

app.listen(PORT, () => {
    console.log(`App rodando em: http://localhost:${PORT}`);
});
