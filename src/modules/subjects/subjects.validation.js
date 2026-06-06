import { z } from "zod";

export const createSubjectSchema = z.object({
  subjectCode: z.string().trim().min(2).max(20)
    .transform((val) => val.toUpperCase()),

  name: z.string().trim().min(2).max(100),
});

export const updateSubjectSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
});

export const assignSubjectSchema = z.object({
  classStreamId: z.string(),
  subjectCode: z.string().trim(),
});