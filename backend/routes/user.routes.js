import { Router } from 'express';
import { createUser, loginUser, getAllUsers, updateUser, deleteUser } from '../controller/user.controller.js';

const router = Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;