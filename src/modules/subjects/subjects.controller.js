import subjectsService from "./subjects.service.js";

import {
  createSubjectSchema,
  updateSubjectSchema,
  assignSubjectSchema,
} from "./subjects.validation.js";

class SubjectsController {
  async create(req, res) {
    try {
        // validate request body
      const validation = createSubjectSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const subject =
        await subjectsService.create(
          validation.data
        );

      return res.status(201).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

//   get all subjects
  async findAll(req, res, next) {
    try {
      const subjects =
        await subjectsService.getAll();

      return res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  }

//   get subject by subject code
  async findOne(req, res, next) {
    try {
      const subject =
        await subjectsService.getBySubjectCode(
          req.params.subjectCode
        );

      if (!subject) {
        return res.status(404).json({
          success: false,
          message:
            "Subject not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

//   update subject by subject code
  async update(req, res, next) {
    try {
      const validation =
        updateSubjectSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const subject =
        await subjectsService.update(
          req.params.subjectCode,
          validation.data
        );

      if (!subject) {
        return res.status(404).json({
          success: false,
          message:
            "Subject not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

//   delete subject by subject code
  async delete(req, res, next) {
    try {
      const subject =
        await subjectsService.delete(
          req.params.subjectCode
        );

      if (!subject) {
        return res.status(404).json({
          success: false,
          message:
            "Subject not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Subject deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

//   assign subject to class stream
  async assignToClassStream(
    req,
    res
  ) {
    try {
      const validation =
        assignSubjectSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const assignment =
        await subjectsService.assignToClassStream(
          validation.data
        );

      return res.status(201).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

//   get subjects by class stream
  async findByClassStream(
    req,
    res,
    next
  ) {
    try {
      const subjects =
        await subjectsService.getSubjectsByClassStream(
          req.params.classStreamId
        );

      return res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SubjectsController();