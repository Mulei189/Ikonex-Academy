import studentsService from "./students.service.js";
import logger from "#config/logger.js";
import {createStudentSchema, 
        updateStudentSchema,
} from "./students.validation.js";

class StudentsController {
    // Create a new student
  async create(req, res, next) {
    try {
        // Validate request body
      const validation = createStudentSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

    //   Create student
      const student = await studentsService.create(validation.data);

      return res.status(201).json({
        success: true,
        data: student,
      });
      logger.info(`Student created with ID: ${student.id}`);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
      logger.error('Error creating student:', error);
    }
  }

//   Get all students
  async findAll(req, res, next) {
    try {
      const students = await studentsService.getAll();

      return res.status(200).json({
        success: true,
        data: students,
      });
      logger.info(`Fetched all students`);
    } catch (error) {
      next(error);
      logger.error('Error fetching students:', error);
    }
  }

//   Get student by ID
  async findOne(req, res, next) {
    try {
      const student = await studentsService.getById(req.params.id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: student,
      });
      logger.info(`Fetched student with ID: ${student.id}`);
    } catch (error) {
      next(error);
        logger.error('Error fetching student:', error);
    }
  }

  // Get student by admission number
  async findByAdmissionNumber(req, res, next) {
    try {
      console.log(
        "ADMISSION NUMBER:",
        req.params.admissionNumber
      );

      const student =
        await studentsService.getByAdmissionNumber(
          req.params.admissionNumber
        );

      console.log("STUDENT:", student);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
      logger.error('Error fetching student by admission number:', error);
    }
  }

//   Get student by class stream
  async findByClassStream(req, res, next) {
    try {
      const students = await studentsService.getByClassStream(
          req.params.classStreamId
        );

      return res.status(200).json({
        success: true,
        data: students,
      });
      logger.info(`Fetched students with class stream ID: ${req.params.classStreamId}`);
    } catch (error) {
      next(error);
      logger.error('Error fetching students by class stream:', error);
    }
  }

//   Update student by admission number
  async update(req, res, next) {
    try {
      const validation = updateStudentSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const student = await studentsService.update(req.params.admissionNumber, validation.data);

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: student,
      });
      logger.info(`Updated student with ID: ${student.id}`);
    } catch (error) {
      next(error);
        logger.error('Error updating student:', error);
    }
  }

//   Delete student by admission number
  async delete(req, res, next) {
    try {
      const student = await studentsService.delete(req.params.admissionNumber);

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Student deleted successfully",
      });
      logger.info(`Deleted student with ID: ${student.id}`);
    } catch (error) {
      next(error);
      logger.error('Error deleting student:', error);
    }
  }
}

export default new StudentsController();