import {formatValidationErrors} from "#utils/format.js";
import { signInUser, signOutUser } from "./auth.service.js";
import logger from "#config/logger.js";
import { cookies } from "#utils/cookie.js";
import { jwttoken } from "#utils/jwt.js";
import { signInSchema } from "./auth.validations.js";


// Sign-in controller
export const signIn = async (req, res, next) => {
    try {
        // Validate input
        const validationResult = signInSchema.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({ 
                details: formatValidationErrors(validationResult.error),
                error: 'Invalid input data for sign-in'
            });
        }

        // Extract validated data
        const {email, password} = validationResult.data;

        // Sign-in user
        const user = await signInUser(email, password);

        // Generate JWT token and store in HTTP-only cookie
        const token =jwttoken.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        })
        cookies.setCookie(res, 'token', token)

        // Respond with user data (excluding password)
        logger.info(`User signed in with email: ${email}`);
        res.status(200).json({
            message: `User signed in successfully with email: ${email}`,
            user: {
                id: user.id,
                email: user.email,  
                role: user.role
            },
            token: token
        })
    } catch (error) {
        logger.error('Error in sign-in controller:', error);
        next(error);
    }
}

// Sign out controller
export const signOut = async (req, res, next) => {
    try {        
        // Call service to handle logout logic
        await signOutUser(req.user?.id);

        // Clear the token cookie
        cookies.clearCookie(res, 'token');

        res.status(200).json({ 
            message: 'User logged out successfully' 
        });
    } catch (error) {
        logger.error('Sign out error', error);
        next(error);
    }
}