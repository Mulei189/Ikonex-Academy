import gradingScalesService from "./grading-scales.service.js";

import {
  createGradingScaleSchema,
  updateGradingScaleSchema,
} from "./grading-scale.validations.js";

class GradingScalesController {
  /**
   * Create grading scale
   */
  async create(req, res, next) {
    try {
      const validation =
        createGradingScaleSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const gradingScale =
        await gradingScalesService.create(
          validation.data
        );

      return res.status(201).json({
        success: true,
        data: gradingScale,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all grading scales
   */
  async findAll(req, res, next) {
    try {
      const gradingScales =
        await gradingScalesService.getAll();

      return res.status(200).json({
        success: true,
        data: gradingScales,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get grading scale by grade
   */
  async findOne(req, res, next) {
    try {
      const gradingScale =
        await gradingScalesService.getByGrade(
          req.params.grade.toUpperCase()
        );

      if (!gradingScale) {
        return res.status(404).json({
          success: false,
          message:
            "Grading scale not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: gradingScale,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update grading scale
   */
  async update(req, res, next) {
    try {
      const validation =
        updateGradingScaleSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const gradingScale =
        await gradingScalesService.update(
          req.params.grade.toUpperCase(),
          validation.data
        );

      if (!gradingScale) {
        return res.status(404).json({
          success: false,
          message:
            "Grading scale not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: gradingScale,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete grading scale
   */
  async delete(req, res, next) {
    try {
      const gradingScale =
        await gradingScalesService.delete(
          req.params.grade.toUpperCase()
        );

      if (!gradingScale) {
        return res.status(404).json({
          success: false,
          message:
            "Grading scale not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Grading scale deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find grade by score
   *
   * Example:
   * GET /api/grading-scales/score/84
   */
  async findGradeByScore(
    req,
    res,
    next
  ) {
    try {
      const score = Number(
        req.params.score
      );

      if (isNaN(score)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid score",
        });
      }

      const gradingScale =
        await gradingScalesService.findGrade(
          score
        );

      if (!gradingScale) {
        return res.status(404).json({
          success: false,
          message:
            "No grade found for score",
        });
      }

      return res.status(200).json({
        success: true,
        data: gradingScale,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GradingScalesController();