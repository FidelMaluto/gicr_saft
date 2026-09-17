import express from 'express';
import {
    QueryProduct,
    CreateProduct,
    EditProduct,
    DeleteProduct
} from '../controllers/product.js'

const router = express.Router();

router.get('/produtos', QueryProduct);
router.post('/produto', CreateProduct);
router.put('/produto/:id', EditProduct);
router.delete('/produto/:id', DeleteProduct);

export default router;
