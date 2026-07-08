const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    port: process.env.db_port
});

db.connect((err) => {
    if(err) { 
        console.log('Erro ao conectar!', err) 
        return;
    } else {
        console.log('Conectado com sucesso.');
    }
});

module.exports = db;
