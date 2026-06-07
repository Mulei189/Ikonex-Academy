import { Router } from "express";
import assessmentsController from "./assessments.controller.js";

const router = Router();

// Create assessment
router.post("/", assessmentsController.create);

// Get student performance for a specific subject
router.get("/student/:admissionNumber/:subjectCode", assessmentsController.findStudentSubjectPerformance);

// Get student performance across all subjects
router.get("/student/:admissionNumber", assessmentsController.findStudentPerformance);

// Get class performance for a specific subject
router.get("/class-stream/:classStreamId/:subjectCode", assessmentsController.findClassPerformance);

// Get class performance comparison across all classes for a specific subject
router.get("/class-comparison/:subjectCode", assessmentsController.findClassPerformanceComparison);

// Get all assessments
router.get("/", assessmentsController.findAll);

// Get assessment by ID
router.get("/:id", assessmentsController.findOne);

// Update assessment
router.patch("/:id", assessmentsController.update);

// Delete assessment
router.delete("/:id", assessmentsController.delete);

export default router;
