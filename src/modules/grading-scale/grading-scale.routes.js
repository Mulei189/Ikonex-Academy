import { Router } from "express";

import gradingScalesController from "./grading-scale.controller.js";

const router = Router();

/**
 * Create grading scale
 */
router.post("/", gradingScalesController.create);

/**
 * Get all grading scales
 */
router.get( "/", gradingScalesController.findAll);

/**
 * Find grade by score
 *
 * Example:
 * GET /api/grading-scales/score/84
 */
router.get("/score/:score", gradingScalesController.findGradeByScore);

/**
 * Get grading scale by grade
 *
 * Example:
 * GET /api/grading-scales/A
 */
router.get("/:grade", gradingScalesController.findOne);

/**
 * Update grading scale
 */
router.patch("/:grade", gradingScalesController.update);

/**
 * Delete grading scale
 */
router.delete("/:grade", gradingScalesController.delete);

export default router;