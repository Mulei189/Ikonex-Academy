import classStreamsService from './class-streams.service.js';
import { createClassStreamSchema, updateClassStreamSchema } from './class-streams.validations.js';

// ClassStreamsController class to handle HTTP requests related to class streams
class ClassStreamsController {
    // Create a new class stream
    async create(req, res, next) {
      console.log("BODY:", req.body); // Debugging: log the incoming request body
      console.log("CLASS STREAM ID:", req.params.classStreamId); // Debugging: log the class stream ID from the URL parameters  
      try {
            // Validate the request body using Zod schema
            const validation = createClassStreamSchema.safeParse(req.body);
            console.log("VALIDATION RESULT:", validation); // Debugging: log the validation result

            if(!validation.success) {
              console.log("VALIDATION ERRORS:", validation.error); // Debugging: log validation errors
                return res.status(400).json({
                    success: false,
                    message: validation.error.message,
                })
            }

            // Call the service to create a new class stream
            const stream = await classStreamsService.
            create(validation.data);

            return res.status(201).json({
                success: true,
                data: stream
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
            next(error);
        }
    }

    // Get all class streams with pagination
    async findAll(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const streams = await classStreamsService.getAll(page, limit);
            return res.status(200).json({
                success: true,
                data: streams
            });
        } catch (error) {
            next(error);
        }
    }

    // find a single class stream by ID
    async getById(req, res, next) {
    try {
        // Call the service to find the class stream by ID
        const stream =
            await classStreamsService.getById(
            req.params.id
            );

        if (!stream) {
            return res.status(404).json({
            success: false,
            message:
                "Class stream not found",
            });
        }

        res.status(200).json({
            success: true,
            data: stream,
        });
        } catch (error) {
        next(error);
        }
    }
    
    // update an existing class stream by ID
    async update(req, res, next) {
    try {
        // Validate the request body using Zod schema
      const validation =
        updateClassStreamSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        console.log("VALIDATION ERRORS:", validation.error); // Debugging: log validation errors
        return res.status(400).json({
          success: false,
          message: validation.error.message,
        });
      }

    //   Call the service to update the class stream
      const stream =
        await classStreamsService.update(
          req.params.id,
          validation.data
        );

      return res.status(200).json({
        success: true,
        data: stream,
      });
    } catch (error) {
      next(error);
    }
  }

    // delete a class stream by ID
    async delete(req, res, next) {
    try {
      await classStreamsService.delete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Class stream deleted",
      });
    } catch (error) {
      next(error);
    }
  }

}
export default new ClassStreamsController();