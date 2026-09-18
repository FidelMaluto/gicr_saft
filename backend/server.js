// Responsável por chamar as rotas e a porta a escutar...
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App rodando em: http://localhost:${PORT}`);
});
