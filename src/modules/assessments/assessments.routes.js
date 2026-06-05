import { Router } from "express";

import assessmentsController from "./assessments.controller.js";

const router = Router();

router.post("/", assessmentsController.create);

router.get("/student/:admissionNumber/:subjectCode", assessmentsController.findStudentSubjectPerformance);

router.get("/student/:admissionNumber", assessmentsController.findStudentPerformance);

router.get("/class-stream/:classStreamId/:subjectCode", assessmentsController.findClassPerformance);

router.get("/:id", assessmentsController.findOne);

router.patch("/:id", assessmentsController.update);

router.delete("/:id", assessmentsController.delete);

export default router;