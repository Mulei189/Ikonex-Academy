import { z } from 'zod';

export const createClassStreamSchema = z.object({
    streamCode: z.string().max(20).min(1),
    name: z.string().max(100).min(2),
});

export const updateClassStreamSchema =
  createClassStreamSchema.partial();