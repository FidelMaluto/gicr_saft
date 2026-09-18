import { db } from '../config/db.js';

export const QueryProduct = async (req, res) => {
    const queryall = 'SELECT * FROM produtos';

    db.query(queryall, (err, data) => {
        if (err) {
            console.log('Erro ao consultar produtos: ', err);
            return res.status(500).json({ message: 'Erro ao consultar produtos: ', err });
        }

        return res.status(200).json(data);

    });
};

export const CreateProduct = async (req, res) => {
    const { nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado } = req.body;

    db.query(`INSERT INTO produtos(nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado)
        VALUES(?,?,?,?,?,?,?,?)
    `, [nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado], (err, data) => {
        if (err) {
            console.log('Erro ao cadastrar produto: ', err);
            return res.status(500).json({ message: 'Erro ao cadastrar produto: ', err });
        }

        return res.status(201).json({
            id: data.insertId, nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado
        });

    })
}

export const EditProduct = async (req, res) => {
    const { id } = req.params;
    const { nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado } = req.body;

    db.query(`UPDATE produtos SET nome = ?, codigoBarra = ?, precoVenda = ?, stockAtual = ?, stockMinimo = ?, 
        precoCusto = ?, regimeIVA = ?, estado = ? WHERE id = ?`,
        [nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado, id], (err, data) => {
            if (err) {
                console.log('Erro ao editar produto: ', err);
                return res.status(500).json({ message: 'Erro ao editar produto, ', err });
            }

            return res.status(201).json({
                id: data.insertId, nome, codigoBarra, precoVenda, stockAtual, stockMinimo, precoCusto, regimeIVA, estado
            });

        });
}

export const DeleteProduct = async (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM produtos WHERE id = ?', [id], (err, data) => {
        if (err) {
            console.log('Erro ao deletar produtos: ', err);
            return res.status(500).status({ message: 'Erro ao deletar produtos: ', err });
        }

        return res.status(200).json({ message: 'Deletado com sucesso!' });

    });
}
