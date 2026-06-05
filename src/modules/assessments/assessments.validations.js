import { z } from "zod";

const assessmentTypes = [
  "CAT1",
  "CAT2",
  "MIDTERM",
  "ENDTERM",
];

export const createAssessmentSchema =
  z.object({
    admissionNumber: z
      .string()
      .trim()
      .min(1),

    subjectCode: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((val) =>
        val.toUpperCase()
      ),

    assessmentType: z.enum(
      assessmentTypes
    ),

    score: z
      .number()
      .int()
      .min(0)
      .max(100),
  });

export const updateAssessmentSchema =
  z.object({
    score: z
      .number()
      .int()
      .min(0)
      .max(100),
  });