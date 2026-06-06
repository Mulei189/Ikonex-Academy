import {
  eq,
  lte,
  gte,
  and,
} from "drizzle-orm";

import { db } from "#config/database.js";

import { gradingScales } from "./grading-scale.models.js";

class GradingScalesService {
  /**
   * Create grading scale
   */
  async create(data) {
    const {
      grade,
      minScore,
      maxScore,
    } = data;

    // Check duplicate grade
    const existingGrade =
      await db
        .select()
        .from(gradingScales)
        .where(
          eq(
            gradingScales.grade,
            grade
          )
        );

    if (existingGrade.length > 0) {
      throw new Error(
        "Grade already exists"
      );
    }

    // Check overlapping ranges
    const overlappingRanges =
      await db
        .select()
        .from(gradingScales)
        .where(
          and(
            lte(
              gradingScales.minScore,
              maxScore
            ),
            gte(
              gradingScales.maxScore,
              minScore
            )
          )
        );

    if (
      overlappingRanges.length > 0
    ) {
      throw new Error(
        "Score range overlaps with an existing grading scale"
      );
    }

    const [gradingScale] =
      await db
        .insert(gradingScales)
        .values(data)
        .returning();

    return gradingScale;
  }

  /**
   * Get all grading scales
   */
  async getAll() {
    return await db
      .select()
      .from(gradingScales);
  }

  /**
   * Get grading scale by grade
   */
  async getByGrade(grade) {
    const [gradingScale] =
      await db
        .select()
        .from(gradingScales)
        .where(
          eq(
            gradingScales.grade,
            grade
          )
        );

    return gradingScale;
  }

  /**
   * Update grading scale
   */
  async update(
    grade,
    data
  ) {
    const currentScale =
      await this.getByGrade(grade);

    if (!currentScale) {
      return null;
    }

    const minScore =
      data.minScore ??
      currentScale.minScore;

    const maxScore =
      data.maxScore ??
      currentScale.maxScore;

    const overlappingRanges =
      await db
        .select()
        .from(gradingScales)
        .where(
          and(
            lte(
              gradingScales.minScore,
              maxScore
            ),
            gte(
              gradingScales.maxScore,
              minScore
            )
          )
        );

    const overlaps =
      overlappingRanges.filter(
        (item) =>
          item.grade !== grade
      );

    if (overlaps.length > 0) {
      throw new Error(
        "Score range overlaps with an existing grading scale"
      );
    }

    const [updatedScale] =
      await db
        .update(gradingScales)
        .set({
          ...data,
          updatedAt:
            new Date(),
        })
        .where(
          eq(
            gradingScales.grade,
            grade
          )
        )
        .returning();

    return updatedScale;
  }

  /**
   * Delete grading scale
   */
  async delete(grade) {
    const [gradingScale] =
      await db
        .delete(gradingScales)
        .where(
          eq(
            gradingScales.grade,
            grade
          )
        )
        .returning();

    return gradingScale;
  }

  /**
   * Find grade for score
   *
   * Used by Results module
   */
  async findGrade(score) {
    const [gradingScale] =
      await db
        .select()
        .from(gradingScales)
        .where(
          and(
            lte(
              gradingScales.minScore,
              score
            ),
            gte(
              gradingScales.maxScore,
              score
            )
          )
        );

    return gradingScale || null;
  }
}

export default new GradingScalesService();