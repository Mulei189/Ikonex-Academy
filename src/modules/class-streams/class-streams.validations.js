import { z } from 'zod';

export const createClassStreamSchema = z.object({
    name: z.string().max(100).min(2),
});

export const updateClassStreamSchema =
  createClassStreamSchema.partial();