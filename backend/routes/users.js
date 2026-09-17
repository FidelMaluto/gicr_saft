import express from 'express';
import {
    QueryUsers,
    CreateUser,
    EditUser,
    DeleteUser
} from '../controllers/user';

const router = express.Router();

router.get('/Utilizadores', QueryUsers);
router.post('/Utilizadore', CreateUser);
router.put('/Utilizadore/:id', EditUser);
router.delete('/Utilizadore/:id', DeleteUser);

export default router;
