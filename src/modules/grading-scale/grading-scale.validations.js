import { z } from "zod";

export const createGradingScaleSchema =
  z
    .object({
      grade: z
        .string()
        .trim()
        .min(1)
        .max(5)
        .transform((val) =>
          val.toUpperCase()
        ),

      minScore: z
        .number()
        .int()
        .min(0)
        .max(100),

      maxScore: z
        .number()
        .int()
        .min(0)
        .max(100),

      remarks: z
        .string()
        .trim()
        .max(100)
        .optional(),
    })
    .refine(
      (data) =>
        data.minScore <=
        data.maxScore,
      {
        message:
          "Minimum score cannot be greater than maximum score",
        path: ["minScore"],
      }
    );

export const updateGradingScaleSchema =
  z
    .object({
      grade: z
        .string()
        .trim()
        .min(1)
        .max(5)
        .transform((val) =>
          val.toUpperCase()
        )
        .optional(),

      minScore: z
        .number()
        .int()
        .min(0)
        .max(100)
        .optional(),

      maxScore: z
        .number()
        .int()
        .min(0)
        .max(100)
        .optional(),

      remarks: z
        .string()
        .trim()
        .max(100)
        .optional(),
    })
    .refine(
      (data) => {
        if (
          data.minScore !== undefined &&
          data.maxScore !== undefined
        ) {
          return (
            data.minScore <=
            data.maxScore
          );
        }

        return true;
      },
      {
        message:
          "Minimum score cannot be greater than maximum score",
        path: ["minScore"],
      }
    );