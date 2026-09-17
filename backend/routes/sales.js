import express from 'express';
import {
    QuerySale,
    CreateSale,
    EditSale,
    DeleteSale
} from '../controllers/sale.js';

const router = express.Router();

router.get('/vendas', QuerySale);
router.post('/venda', CreateSale);
router.put('/venda/:id', EditSale);
router.delete('/venda/:id', DeleteSale);

export default router;
