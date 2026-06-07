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

      if (!admissionNumber) {
        return res.status(400).json({
          success: false,
          message: "Admission number is required",
        });
      }

      const filePath =
        await reportsService.generateStudentReport(
          admissionNumber
        );

      return res.download(
        filePath,
        `${admissionNumber}-report-card.pdf`
      );
    } catch (error) {
      console.error("Error generating student report:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to generate student report",
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

      if (!classStreamId) {
        return res.status(400).json({
          success: false,
          message: "Class stream ID is required",
        });
      }

      const filePath =
        await reportsService.generateClassReport(
          classStreamId
        );

      return res.download(
        filePath,
        `${classStreamId}-class-report.pdf`
      );
    } catch (error) {
      console.error("Error generating class report:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to generate class report",
      });
    }
  }
}

export default new ReportsController();