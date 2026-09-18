import { db } from '../config/db.js';

export const QueryItemSale = async (req, res) => {
    const queryAll = 'SELECT * FROM itens_venda';

    db.query(queryAll, (err, data) => {
        if (err) {
            console.log('Erro ao consultar os itens: ', err);
            return res.status(500).json({ message: 'Erro ao consultar os itens: ', err });
        }

        return res.status(200).json(data);

    });
};

export const CreateItemVenda = async (req, res) => {
    const { vendaID, produtoID, quantidade, precoUnitario } = req.body;

    db.query('INSERT INTO itens_venda(vendaID, produtoID, quantidade, precoUnitario) VALUES(?,?,?,?)',
        [vendaID, produtoID, quantidade, precoUnitario], (err, data) => {
            if (err) {
                console.log('Erro ao cadastrar item: ', err);
                return res.status(500).json({ message: 'Erro ao cadastrar item: ', err });
            }

            return res.status(201).json({
                id: data.insertId, vendaID, produtoID, quantidade, precoUnitario
            });

        });
};

export const EditItemVenda = async (req, res) => {
    const { id } = req.params;
    const { vendaID, produtoID, quantidade, precoUnitario } = req.body;

    db.query(`UPDATE itens_venda SET vendaID = ?, produtoID = ?, quantidade = ?, precoUnitario = ? WHERE id = ?`,
        [vendaID, produtoID, quantidade, precoUnitario, id], (err, data) => {
            if (err) {
                console.log('Erro ao editar item: ', err);
                return res.status(500).json({ message: 'Erro ao editar item: ', item });
            }

            return res.status(201).json({
                id: data.insertId, vendaID, produtoID, quantidade, precoUnitario
            });

        });
};

export const DeleteItemVenda = async (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM itens_venda WHERE id = ?', [id], (err, data) => {
        if (err) {
            console.log('Erro ao deletar item: ', err);
            return res.status(500).json({ message: 'Erro ao deletar item: ', err });
        }

        return res.status(200).json({ message: 'Deletado com sucesso!' });

    });
};
