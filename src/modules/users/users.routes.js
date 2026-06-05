import express from 'express';
import { signUp, getUsersController, getUserByIdController, updateUserController, deleteUserController } from './users.controllers.js';

const router = express.Router();

// Sign-up route
router.post('/sign-up', signUp);

// Get all users with pagination
router.get('/', getUsersController);

// Get user by ID
router.get('/:id', getUserByIdController);

// Update user
router.put('/:id', updateUserController);

// Delete user
router.delete('/:id', deleteUserController);

export default router;