import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const QueryUsers = async (req, res) => {
    const queryAll = 'SELECT * FROM utilizadores';

    db.query(queryAll, (err, data) => {
        if (err) {
            console.log('Erro ao consultar utilizadores: ', err);
            return res.status(500).json({ message: 'Erro ao consultar utilizadores: ', err });
        }

        return res.status(200).json(data);

    });
};

export const CreateUser = async (req, res) => {
    // Recebe a password em texto limpo vinda do body (ex: password)
    const { nome, email, senhaCifrada, cargo } = req.body;

    if (!nome || !email || !senhaCifrada) {
        return res.status(400).json({ message: 'Nome, email e password são obrigatórios.' });
    }

    try {
        // 1. Gera o Salt e Cifra a password no backend
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senhaCifrada, salt);

        // 2. Insere na base de dados guardando o HASH gerado
        const query = 'INSERT INTO utilizadores (nome, email, senhaCifrada, cargo) VALUES (?, ?, ?, ?)';

        db.query(query, [nome, email, senhaHash, cargo], (err, data) => {
            if (err) {
                console.log('Erro ao cadastrar utilizador: ', err);
                return res.status(500).json({ message: 'Erro ao cadastrar utilizador.', error: err });
            }

            // 3. Retorna os dados SEM expor a password/hash na resposta
            return res.status(201).json({
                message: 'Utilizador criado com sucesso!',
                user: {
                    id: data.insertId,
                    nome,
                    email,
                    cargo
                }
            });
        });

    } catch (hashError) {
        console.log('Erro ao gerar hash da password: ', hashError);
        return res.status(500).json({ message: 'Erro interno ao processar a password.' });
    }
};

export const EditUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senhaCifrada, cargo } = req.body;

    db.query(`UPDATE utilizadores SET nome = ?, email = ?, senhaCifrada = ?, cargo = ? WHERE id = ?`,
        [nome, email, senhaCifrada, cargo, id], (err, data) => {
            if (err) {
                console.log('Erro ao editar utilizador: ', err);
                return res.status(500).json({ message: 'Erro ao editar utilizador: ', err });
            }

            return res.status(201).json({
                id: data.insertId, nome, email, senhaCifrada, cargo
            });

        });
};

export const DeleteUser = async (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM utilizadores WHERE id = ?', [id], (err, data) => {
        if (err) {
            console.log('Erro ao deletar utilizador: ', err);
            return res.status(500).json({ message: 'Erro ao deletar utilizador: ', err });
        }

        return res.status(200).json({ message: 'Deletado com sucesso!' });

    });
};
