import logger from '#config/logger.js';
import { db } from '#config/database.js';
import bcrypt from 'bcryptjs';
import {eq} from 'drizzle-orm';
import {users} from '../users/users.models.js';

// Sign in user function
export const signInUser = async (email, password) => {
    try {
        // Find user by email using raw SQL to avoid Drizzle ENUM issues
        const result = await sql`
            SELECT id, name, email, password, role, created_at, updated_at
            FROM users
            WHERE email = ${email}
            LIMIT 1
        `;
        
        if(result.length === 0) {
            logger.warn(`No user found with email: ${email}`);
            throw new Error('Invalid email');
        }

        const user = result[0];
        
        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            logger.warn(`Invalid password for email: ${email}`);
            throw new Error('Invalid password');
        }

        logger.info(`User signed in with email: ${email}`);
        return ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        });
    } catch (error) {
        logger.error('Error signing in user:', error);
        throw new Error('Error signing in user');
    }
}

// Sign-out logic
export const signOutUser = (userId) => {
    try {
       logger.info(`User ${userId} logged out successfully`);
        return { success: true };
    } catch (error) {
        logger.error('Error logging out user', error);
        throw new Error('Failed to log out user');
    }
}