import assessmentsService from "./assessments.service.js";

import {
  createAssessmentSchema,
  updateAssessmentSchema,
} from "./assessments.validations.js";

class AssessmentsController {
  // record assessment score
  async create(req, res, next) {
    try {
      const validation =
        createAssessmentSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const assessment =
        await assessmentsService.create(
          validation.data
        );

      return res.status(201).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  //Get assessment by ID
  async findOne(req, res, next) {
    try {
      const assessment =
        await assessmentsService.getById(
          req.params.id
        );

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message:
            "Assessment not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  // UPDATE ASSESSMENT SCORE
  async update(req, res, next) {
    try {
      const validation =
        updateAssessmentSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const assessment =
        await assessmentsService.update(
          req.params.id,
          validation.data
        );

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message:
            "Assessment not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  //Delete assessment
  async delete(req, res, next) {
    try {
      const assessment =
        await assessmentsService.delete(
          req.params.id
        );

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message:
            "Assessment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Assessment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // student performance
  async findStudentPerformance(
    req,
    res,
    next
  ) {
    try {
      const performance =
        await assessmentsService.getStudentPerformance(
          req.params.admissionNumber
        );

      return res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // student performance by subject
  async findStudentSubjectPerformance(
    req,
    res,
    next
  ) {
    try {
      const performance =
        await assessmentsService.getStudentSubjectPerformance(
          req.params.admissionNumber,
          req.params.subjectCode
        );

      return res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // create performance by subject
  async findClassPerformance(
    req,
    res,
    next
  ) {
    try {
      const performance =
        await assessmentsService.getClassPerformance(
          req.params.classStreamId,
          req.params.subjectCode
        );

      return res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AssessmentsController();