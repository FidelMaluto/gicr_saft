import express from 'express';
import {
    QueryUsers,
    CreateUser,
    EditUser,
    DeleteUser
} from '../controllers/user.js';

const router = express.Router();

router.get('/Utilizadores', QueryUsers);
router.post('/Utilizador', CreateUser);
router.put('/Utilizador/:id', EditUser);
router.delete('/Utilizador/:id', DeleteUser);

export default router;
