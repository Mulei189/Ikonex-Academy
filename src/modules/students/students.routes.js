import { Router } from "express";

import studentsController from "./students.controller.js";

const router = Router();

router.post("/", studentsController.create);

router.get("/", studentsController.findAll);

router.get("/stream/:classStreamId", studentsController.findByClassStream
);

router.get("/admissionNumber/:admissionNumber", studentsController.findByAdmissionNumber);

router.patch("/admissionNumber/:admissionNumber", studentsController.update
);

router.delete( "/admissionNumber/:admissionNumber", studentsController.delete);

export default router;