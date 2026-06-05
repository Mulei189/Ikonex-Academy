import {formatValidationErrors} from "#utils/format.js";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "./users.service.js";
import logger from "#config/logger.js";
import { cookies } from "#utils/cookie.js";
import { jwttoken } from "#utils/jwt.js";
import { signUpSchema } from "./users.validations.js";

// Sign-up controller
export const signUp = async (req, res, next) => {
    try {
        // Validate input
        const validationResult = signUpSchema.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({ 
                details: formatValidationErrors(validationResult.error),
                error: 'Invalid input data for sign-up'
            });
        }

        // Extract validated data
        const { name, email, password, role} = validationResult.data;

        // Create user
        const newUser = await createUser(name, email, password, role);

        // Generate JWT token and store in HTTP-only cookie
        const token = jwttoken.sign({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role
        })
        cookies.setCookie(res, 'token', token);

        // Respond with user data (excluding password)
        logger.info(`User signed up with email: ${email}`);
        return res.status(201).json({
            message: `User registered successfully with email: ${email}`,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            token: token
        })
    } catch (error) {
        logger.error('Error in sign-up controller:', error);
        if(error.message === 'User with this email already exists') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next(error);
    }
}

// Get users controller with pagination
export const getUsersController = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const usersList = await getUsers(page, limit);
        res.status(200).json({ users: usersList });
    } catch (error) {
        logger.error('Error in get users controller:', error);
        next(error);
    }
};

// Get user by ID controller
export const getUserByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        logger.error('Error in get user by ID controller:', error);
        next(error);
    }
};

// Update user controller
export const updateUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await updateUser(id, userData);
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        logger.error('Error in update user controller:', error);
        next(error);
    }
};

// Delete user controller
export const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error in delete user controller:', error);
        next(error);
    }
};
