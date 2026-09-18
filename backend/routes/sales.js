import express from 'express';
import {
    QuerySale,
    CreateSale,
    EditSale,
    DeleteSale
} from '../controllers/sale.js';

const router = express.Router();

router.get('/Vendas', QuerySale);
router.post('/Venda', CreateSale);
router.put('/Venda/:id', EditSale);
router.delete('/Venda/:id', DeleteSale);

export default router;
