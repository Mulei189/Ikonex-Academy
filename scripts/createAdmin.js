import { db, sql } from '../src/config/database.js';
import { users } from '../src/modules/users/users.models.js';
import bcrypt from 'bcryptjs';
import logger from '../src/config/logger.js';

// Create admin user
const createAdminUser = async () => {
    try {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        
        console.log('Hashed password created');
        console.log('Attempting to insert user...');
        
        // Try raw SQL insert for debugging
        const result = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${'Admin User'}, ${'admin@ikonex.com'}, ${hashedPassword}, ${'admin'})
            RETURNING id, name, email, role, created_at, updated_at
        `;

        logger.info('Admin user created successfully:', result[0]);
        console.log('✓ Admin user created successfully!');
        console.log('ID:', result[0].id);
        console.log('Email: admin@ikonex.com');
        console.log('Password: Admin@123');
        process.exit(0);
    } catch (error) {
        const errorMsg = error.message || JSON.stringify(error);
        
        if (errorMsg.includes('unique constraint') || errorMsg.includes('duplicate key') || errorMsg.includes('already exists')) {
            logger.warn('Admin user already exists');
            console.log('⚠ Admin user with this email already exists');
            process.exit(0);
        } else if (errorMsg.includes('does not exist') || errorMsg.includes('no such table')) {
            console.error('✗ Database schema not found!');
            console.error('Please run migrations first:');
            console.error('  npm run db:push');
            logger.error('Database schema not found - migrations required');
            process.exit(1);
        } else {
            logger.error('Error creating admin user:', error);
            console.error('✗ Error creating admin user');
            console.error('Error details:', error);
            console.error('\nTroubleshooting:');
            console.error('1. Verify tables exist: users and user_role enum');
            console.error('2. Check DATABASE_URL is correct in .env');
            console.error('3. Ensure network access to database');
            process.exit(1);
        }
    }
};

createAdminUser();
