import express from 'express';
import {
    QueryProduct,
    CreateProduct,
    EditProduct,
    DeleteProduct
} from '../controllers/product.js'

const router = express.Router();

router.get('/Produtos', QueryProduct);
router.post('/Produto', CreateProduct);
router.put('/Produto/:id', EditProduct);
router.delete('/Produto/:id', DeleteProduct);

export default router;
