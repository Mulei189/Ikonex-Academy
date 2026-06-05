import { Router } from "express";

import subjectsController from "./subjects.controller.js";

const router = Router();

router.post("/", subjectsController.create);

router.get( "/", subjectsController.findAll);

router.post("/assign",subjectsController.assignToClassStream);

router.get("/class-stream/:classStreamId", subjectsController.findByClassStream);

router.get("/code/:subjectCode", subjectsController.findOne);

router.patch("/code/:subjectCode", subjectsController.update);

router.delete("/code/:subjectCode", subjectsController.delete
);

export default router;