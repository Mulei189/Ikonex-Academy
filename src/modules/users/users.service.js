import logger from '#config/logger.js';
import { db, sql } from '#config/database.js';
import bcrypt from 'bcryptjs';
import {eq} from 'drizzle-orm';
import {users} from './users.models.js';

// Hashing passwords function
const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
}

// User creation function
export const createUser = async (userData) => {
    try{
        // Check if user already exists
        const existingUser = await sql`
            SELECT id FROM users WHERE email = ${userData.email} LIMIT 1
        `;
        
        if(existingUser.length > 0){
            throw new Error('User with this email already exists');
        }
        
        // Hash the password before saving
        const hashedPassword = await hashPassword(userData.password);

        // Insert user into the database
        const result = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${userData.name}, ${userData.email}, ${hashedPassword}, ${userData.role || 'user'})
            RETURNING id, name, email, role, created_at, updated_at
        `;
        
        const newUser = result[0];
        logger.info(`User created with ID: ${newUser.id}`);
        return newUser;
    } catch (error) {
        logger.error('Error creating user:', error);
        throw new Error('Error creating user');
    }
}

// Get users with pagination
export const getUsers = async (page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;
        const usersList = await sql`
            SELECT id, name, email, role, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;
        return usersList;
    } catch (error) {
        logger.error('Error fetching users:', error);
        throw new Error('Error fetching users');
    }
};

// Get user by id
export const getUserById = async (id) => {
    try {
        const result = await sql`
            SELECT id, name, email, role, created_at, updated_at
            FROM users
            WHERE id = ${id}
            LIMIT 1
        `;
        return result[0] || null;
    } catch (error) {
        logger.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }
};

// Update user
export const updateUser = async (id, userData) => {
    try {
        // Simple update - only update fields that are provided
        let updatedUser = null;
        
        if (userData.name !== undefined) {
            const result = await sql`
                UPDATE users
                SET name = ${userData.name}, updated_at = now()
                WHERE id = ${id}
                RETURNING id, name, email, role, created_at, updated_at
            `;
            updatedUser = result[0];
        }
        
        if (userData.email !== undefined) {
            const result = await sql`
                UPDATE users
                SET email = ${userData.email}, updated_at = now()
                WHERE id = ${id}
                RETURNING id, name, email, role, created_at, updated_at
            `;
            updatedUser = result[0];
        }
        
        if (userData.password !== undefined) {
            const result = await sql`
                UPDATE users
                SET password = ${userData.password}, updated_at = now()
                WHERE id = ${id}
                RETURNING id, name, email, role, created_at, updated_at
            `;
            updatedUser = result[0];
        }
        
        if (userData.role !== undefined) {
            const result = await sql`
                UPDATE users
                SET role = ${userData.role}, updated_at = now()
                WHERE id = ${id}
                RETURNING id, name, email, role, created_at, updated_at
            `;
            updatedUser = result[0];
        }
        
        // If no fields were updated, return the current user
        if (!updatedUser) {
            updatedUser = await getUserById(id);
        }
        
        return updatedUser;
    } catch (error) {
        logger.error('Error updating user:', error);
        throw new Error('Error updating user');
    }  
}

// Delete user
export const deleteUser = async (id) => {
    try {
        await sql`
            DELETE FROM users WHERE id = ${id}
        `;
    } catch (error) {
        logger.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    }
}