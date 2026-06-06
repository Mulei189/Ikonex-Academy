import reportsService from "./reports.service.js";

class ReportsController {
  /**
   * Generate Student Report Card
   *
   * GET /api/reports/student/:admissionNumber
   */
  async generateStudentReport(
    req,
    res,
    next
  ) {
    try {
      const { admissionNumber } =
        req.params;

      const filePath =
        await reportsService.generateStudentReport(
          admissionNumber
        );

      return res.download(
        filePath,
        `${admissionNumber}-report-card.pdf`
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Generate Class Performance Report
   *
   * GET /api/reports/class-stream/:classStreamId
   */
  async generateClassReport(
    req,
    res,
    next
  ) {
    try {
      const { classStreamId } =
        req.params;

      const filePath =
        await reportsService.generateClassReport(
          classStreamId
        );

      return res.download(
        filePath,
        `${classStreamId}-class-report.pdf`
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ReportsController();