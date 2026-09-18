import { db } from '../config/db.js';

export const QuerySale = async (req, res) => {
    const queryAll = 'SELECT * FROM vendas';

    db.query(queryAll, (err, data) => {
        if (err) {
            console.log('Erro ao consultar vendas: ', err);
            return res.status(500).json({ message: 'Erro ao consultar vendas: ', err });
        }

        return res.status(200).json(data);

    });
};

export const CreateSale = async (req, res) => {
    const { formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido } = req.body;

    db.query(`INSERT INTO vendas(formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido) 
        VALUES(?,?,?,?,?,?,?)`,
        [formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido], (err, data) => {
            if (err) {
                console.log('Erro ao cadastrar venda: ', err);
                return res.status(500).json({ message: 'Erro ao cadastrar venda: ', err });
            }

            return res.status(201).json({
                id: data.insertId, formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido
            });

        });
};

export const EditSale = async (req, res) => {
    const { id } = req.params;
    const { formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido } = req.body;

    db.query(`UPDATE vendas SET formaPagamento = ?, clienteID = ?, totalVenda = ?, valorIVA = ?, utilizadorID = ?, 
        dataVenda = ?, totalLiquido = ? WHERE id = ?`,
        [formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido, id], (err, data) => {
            if (err) {
                console.log('Erro ao editar venda: ', err);
                return res.status(500).json({ message: 'Erro ao editar venda: ', err });
            }

            return res.status(201).json({
                id: data.insertId, formaPagamento, clienteID, totalVenda, valorIVA, utilizadorID, dataVenda, totalLiquido
            });

        });
};

export const DeleteSale = async (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM vendas WHERE id = ?', [id], (err, data) => {
        if (err) {
            console.log('Erro ao deletar venda: ', err);
            return res.status(500).json({ message: 'Erro ao deletar venda: ', err });
        }

        return res.status(200).json({ message: 'Deletada com sucesso!' });

    });
};
