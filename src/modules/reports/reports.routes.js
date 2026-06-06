import { Router } from "express";

import reportsController from "./reports.controller.js";

const router = Router();

/**
 * Student Report Card
 *
 * GET /api/reports/student/ADM001
 */
router.get("/student/:admissionNumber", reportsController.generateStudentReport);

/**
 * Class Performance Report
 *
 * GET /api/reports/class-stream/:classStreamId
 */
router.get("/class-stream/:classStreamId", reportsController.generateClassReport);

export default router;