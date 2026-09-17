import express from 'express';
import {
    QueryItemSale,
    CreateItemVenda,
    EditItemVenda,
    DeleteItemVenda
} from '../controllers/itemSale';

const router = express.Router();

router.get('/itensVenda', QueryItemSale);
router.post('/itensVenda', CreateItemVenda);
router.put('/itensVenda/:id', EditItemVenda);
router.delete('/itensVenda/:id', DeleteItemVenda);

export default router
