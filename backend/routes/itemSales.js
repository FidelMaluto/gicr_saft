import express from 'express';
import {
    QueryItemSale,
    CreateItemVenda,
    EditItemVenda,
    DeleteItemVenda
} from '../controllers/itemSale.js';

const router = express.Router();

router.get('/ItensVenda', QueryItemSale);
router.post('/ItensVenda', CreateItemVenda);
router.put('/ItensVenda/:id', EditItemVenda);
router.delete('/ItensVenda/:id', DeleteItemVenda);

export default router
