import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e password são obrigatórios.' });
    }

    db.query('SELECT * FROM utilizadores WHERE email = ?', [email], async (err, data) => {
        if (err) {
            console.log('Erro ao consultar utilizador: ', err);
            return res.status(500).json({ message: 'Erro ao consultar utilizador: ', err });
        }

        if (!data || data.length === 0) {
            // Mensagem genérica de propósito — não revela se o email existe ou não
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const user = data[0];

        try {
            const senhaValida = await bcrypt.compare(password, user.senhaCifrada);

            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            if (!process.env.JWT_SECRET) {
                console.log('JWT_SECRET não está definido no .env');
                return res.status(500).json({ message: 'Configuração do servidor incompleta (JWT_SECRET em falta).' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, cargo: user.cargo },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    cargo: user.cargo
                }
            });

        } catch (compareErr) {
            console.log('Erro ao validar password: ', compareErr);
            return res.status(500).json({ message: 'Erro ao validar password: ', compareErr });
        }
    });
};
