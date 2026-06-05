import { z } from 'zod';

// Sign-in validation schema
export const signInSchema = z.object({
    email: z.string().email().max(255).trim().toLowerCase(),
    password: z.string().min(6).max(255),
})