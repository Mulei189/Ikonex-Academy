import resultsService from "./results.service.js";

class ResultsController {
  /**
   * Get student result
   *
   * GET /api/results/student/ADM001
   */
  async getStudentResult(
    req,
    res,
    next
  ) {
    try {
      const result =
        await resultsService.getStudentResult(
          req.params.admissionNumber
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get class results
   *
   * GET /api/results/class-stream/:classStreamId
   */
  async getClassResults(
    req,
    res,
    next
  ) {
    try {
      const results =
        await resultsService.getClassResults(
          req.params.classStreamId
        );

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get class positions
   *
   * GET /api/results/class-stream/:classStreamId/positions
   */
  async getClassPositions(
    req,
    res,
    next
  ) {
    try {
      const positions =
        await resultsService.getClassPositions(
          req.params.classStreamId
        );

      return res.status(200).json({
        success: true,
        data: positions,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get subject positions
   *
   * GET /api/results/class-stream/:classStreamId/subject/MAT
   */
  async getSubjectPositions(
    req,
    res,
    next
  ) {
    try {
      const positions =
        await resultsService.getSubjectPositions(
          req.params.classStreamId,
          req.params.subjectCode
        );

      return res.status(200).json({
        success: true,
        data: positions,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get student rank
   *
   * GET /api/results/rank/ADM001
   */
  async getStudentRank(
    req,
    res,
    next
  ) {
    try {
      const rank =
        await resultsService.getStudentRank(
          req.params.admissionNumber
        );

      return res.status(200).json({
        success: true,
        data: rank,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ResultsController();