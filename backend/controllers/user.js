import { db } from '../config/db.js';

export const QueryUsers = async (req, res) => {
    const queryAll = 'SELECT * FROM utilizadores';

    db.query(queryAll, (err, data) => {
        if (err) {
            console.log('Erro ao consultar utilizadores: ', err);
            return res.status(500).json({ message: 'erro ao consultar utilizadores: ', err });
        }

        return res.status(200).json(data);

    });
};

export const CreateUser = async (req, res) => {
    const { nome, email, senhaCifrada, cargo } = req.body;

    db.query('INSERT INOT utilizadores(nome, email, senhaCifrada, cargo) VALUES(?,?,?,?)',
        [nome, email, senhaCifrada, cargo], (err, data) => {
            if (err) {
                console.log('Erro ao cadastrar utilzador: ', err);
                return res.status(500).json({ message: 'Erro ao cadastrar utilizador: ', err });
            }

            return res.status(201).json({
                id: data.insertId, nome, email, senhaCifrada, cargo
            });

        });
};

export const EditUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senhaCifrada, cargo } = req.bady;

    db.query(`UPDATE utilizadores SET nome = ?, email = ?, senhaCifrada = ?, cargo = ?`,
        [nome, email, senhaCifrada, cargo, id], (err, data) => {
            if (err) {
                console.log('Erro ao editar utilizador: ', err);
                return res.status(500).json({ message: 'Erro ao eeditar utilizador: ', err });
            }

            return res.status(201).json({
                id: data.insertId, nome, email, senhaCifrada, cargo
            });

        });
};

export const DeleteUser = async (req, res) => {
    const { id } = req.params;

    db.query('DELET FROM utilizadores WHERE id = ?', [id], (err, data) => {
        if (err) {
            console.log('Erro ao deletar utilizador: ', err);
            return res.status(500).json({ message: 'Erro ao deletar utilizador: ', err });
        }

        return res.status(200).json({ message: 'Deletado com sucesso!' });

    });
};
