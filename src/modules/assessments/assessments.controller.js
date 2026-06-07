import assessmentsService from "./assessments.service.js";
import logger from "#config/logger.js";
import {
  createAssessmentSchema,
  updateAssessmentSchema,
} from "./assessments.validations.js";

// AssessmentsController class to handle HTTP requests related to assessments
class AssessmentsController {
  // Record assessment score for a student
  async create(req, res, next) {
    try {
      // Validate the request body using Zod schema
      const validation = createAssessmentSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors: validation.error.flatten(),
        });
      }

      // Call the service to create a new assessment
      const assessment = await assessmentsService.create(validation.data);

      return res.status(201).json({
        success: true,
        data: assessment,
      });
      logger.info(`Assessment created with ID: ${assessment.id}`);
    } catch (error) {
      logger.error("Error creating assessment:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get assessment by ID
  async findOne(req, res, next) {
    try {
      // Call the service to find the assessment by ID
      const assessment = await assessmentsService.getById(req.params.id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: assessment,
      });
      logger.info(`Fetched assessment with ID: ${assessment.id}`);
    } catch (error) {
      next(error);
      logger.error('Error fetching assessment:', error);
    }
  }

  // Get all assessments
  async findAll(req, res, next) {
    try {
      const assessments = await assessmentsService.getAll();

      return res.status(200).json({
        success: true,
        data: assessments,
      });
      logger.info(`Fetched all assessments`);
    } catch (error) {
      next(error);
      logger.error('Error fetching assessments:', error);
    }
  }

  // Update assessment score
  async update(req, res, next) {
    try {
      // Validate the request body using Zod schema
      const validation = updateAssessmentSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors: validation.error.flatten(),
        });
      }

      // Call the service to update the assessment
      const assessment = await assessmentsService.update(req.params.id, validation.data);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: assessment,
      });
      logger.info(`Updated assessment with ID: ${assessment.id}`);
    } catch (error) {
      next(error);
      logger.error('Error updating assessment:', error);
    }
  }

  // Delete assessment
  async delete(req, res, next) {
    try {
      const assessment = await assessmentsService.delete(req.params.id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Assessment deleted successfully",
      });
      logger.info(`Deleted assessment with ID: ${assessment.id}`);
    } catch (error) {
      next(error);
      logger.error('Error deleting assessment:', error);
    }
  }

  // Get student performance across all subjects
  async findStudentPerformance(req, res, next) {
    try {
      const performance = await assessmentsService.getStudentPerformance(req.params.admissionNumber);

      return res.status(200).json({
        success: true,
        data: performance,
      });
      logger.info(`Fetched student performance for admission number: ${req.params.admissionNumber}`);
    } catch (error) {
      logger.error("Error fetching student performance:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get student performance for a specific subject
  async findStudentSubjectPerformance(req, res, next) {
    try {
      const performance = await assessmentsService.getStudentSubjectPerformance(
        req.params.admissionNumber,
        req.params.subjectCode
      );

      return res.status(200).json({
        success: true,
        data: performance,
      });
      logger.info(`Fetched student subject performance for admission number: ${req.params.admissionNumber}, subject: ${req.params.subjectCode}`);
    } catch (error) {
      logger.error("Error fetching student subject performance:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get class performance for a specific subject
  async findClassPerformance(req, res, next) {
    try {
      const performance = await assessmentsService.getClassPerformance(
        req.params.classStreamId,
        req.params.subjectCode
      );

      return res.status(200).json({
        success: true,
        data: performance,
      });
      logger.info(`Fetched class performance for class stream ID: ${req.params.classStreamId}, subject: ${req.params.subjectCode}`);
    } catch (error) {
      logger.error("Error fetching class performance:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get class performance comparison across all classes for a specific subject
  async findClassPerformanceComparison(req, res, next) {
    try {
      const comparison = await assessmentsService.getClassPerformanceComparison(req.params.subjectCode);

      return res.status(200).json({
        success: true,
        data: comparison,
      });
      logger.info(`Fetched class performance comparison for subject: ${req.params.subjectCode}`);
    } catch (error) {
      logger.error("Error fetching class performance comparison:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AssessmentsController();
