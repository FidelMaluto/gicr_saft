import express from 'express';
import { 
    QueryCustomer, 
    CreateCustomer, 
    EditCustomer, 
    DeleteCustomer 
} from "../controllers/customer";

const router = express.Router();

router.get('/Clientes', QueryCustomer);
router.post('/Cliente', CreateCustomer);
router.put('/Cliente/:id', EditCustomer);
router.delete('/Clientes', DeleteCustomer);

export default router;
