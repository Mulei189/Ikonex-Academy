import { Router } from "express";

import resultsController from "./results.controller.js";

const router = Router();

/**
 * Student Result
 *
 * GET /api/results/student/ADM001
 */
router.get("/student/:admissionNumber", resultsController.getStudentResult);

/**
 * Student Rank
 *
 * GET /api/results/rank/ADM001
 */
router.get("/rank/:admissionNumber", resultsController.getStudentRank);

/**
 * Class Positions
 *
 * GET /api/results/class-stream/:classStreamId/positions
 */
router.get("/class-stream/:classStreamId/positions", resultsController.getClassPositions);

/**
 * Subject Positions
 *
 * GET /api/results/class-stream/:classStreamId/subject/:subjectCode",
 */
router.get("/class-stream/:classStreamId/subject/:subjectCode", resultsController.getSubjectPositions);

/**
 * Class Results
 *
 * GET /api/results/class-stream/:classStreamId
 */
router.get("/class-stream/:classStreamId", resultsController.getClassResults);

export default router;