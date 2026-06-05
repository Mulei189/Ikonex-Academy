import { z } from "zod";

export const createStudentSchema =
  z.object({admissionNumber: z.string().trim().min(1),
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    gender: z.enum(["Male", "Female",]),
    dateOfBirth: z.string().optional(),
    classStreamId: z.uuid(),
  });

export const updateStudentSchema =
  createStudentSchema.partial();