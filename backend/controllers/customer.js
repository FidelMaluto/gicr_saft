import { db } from '../config/db.js';

export const QueryCustomer = async (req, res) => {
    const queryAll = 'SELECT * FROM clientes';

    db.query(queryAll, (err, data) => {
        if (err) {
            console.log('Erro ao fazer consultar: ', err);
            return res.status(500).json({ message: 'Erro ao fazer consultar: ', err })
        }

        return res.status(200).json(data);

    })
}

export const CreateCustomer = async (req, res) => {
    const { nome, nif, telefone, email } = req.body;

    db.query('INSERT INTO clientes(nome, nif, telefone, email) VALUES(?,?,?,?)',
        [nome, nif, telefone, email],
        (err, data) => {
            if (err) {
                console.log('Erro ao cadastrar cliente: ', err);
                return res.status(500).json({ message: 'Erro ao cadastrar cliente: ', err })
            }

            return res.status(201).json({
                id: data.insertId, nome, nif, telefone, email
            });

        }
    );
};

export const EditCustomer = async (req, res) => {
    const { id } = req.params;
    const { nome, nif, telefone, email } = req.body;

    db.query('UPDATE clientes SET nome = ?, nif = ?, telefone = ?, email = ?',
        [nome, nif, telefone, email, id], (err, data) => {
            if (err) {
                console.log('Erro ao editar cliente: ', err);
                return res.status(500).json({ message: 'Erro ao editar cliente: ', err });
            }

            return res.status(201).json({
                id: data.insertId, nome, nif, telefone, email
            });

        }
    );
};

export const DeleteCustomer = async (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM clientes WHERE id = ?', [id], (err, data) => {
        if (err) {
            console.log('Erro ao deletar cliente: ', err);
            return res.status(500).json({ message: 'Erro ao deletar cliente: ', err });
        }

        return res.status(200).json({ message: 'Deletado com sucesso!' });

    });
};
