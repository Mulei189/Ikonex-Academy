import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { eq } from "drizzle-orm";

import { db } from "#config/database.js";
import { classStreams } from "../class-streams/class-streams.models.js";
import resultsService from "../results/results.service.js";

class ReportsService {
  /**
   * Generate Student Report Card
   */
  async generateStudentReport(
    admissionNumber
  ) {
    const result =
      await resultsService.getStudentResult(
        admissionNumber
      );

    const rank =
      await resultsService.getStudentRank(
        admissionNumber
      );

    const [streamInfo] = await db
      .select()
      .from(classStreams)
      .where(
        eq(
          classStreams.id,
          result.student.classStreamId
        )
      );

    const reportsDir = path.join(
      process.cwd(),
      "generated-reports",
      "students"
    );

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, {
        recursive: true,
      });
    }

    const filePath = path.join(
      reportsDir,
      `${admissionNumber}-report-card.pdf`
    );

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    const stream =
      fs.createWriteStream(filePath);

    doc.pipe(stream);

    /**
     * Header
     */
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("IKONEX ACADEMY", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .text("STUDENT REPORT CARD", {
        align: "center",
      });

    doc.moveDown(2);

    /**
     * Student Details
     */
    doc.font("Helvetica");
    doc.fontSize(12);

    doc.text(
      `Admission Number: ${result.student.admissionNumber}`
    );

    doc.text(
      `Name: ${result.student.firstName} ${result.student.lastName}`
    );

    doc.text(
      `Class Stream: ${streamInfo?.name ?? "N/A"}`
    );

    doc.moveDown();

    /**
     * Subject Results Table
     */
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Subject Results");

    doc.moveDown();

    let y = doc.y;

    const pageWidth = doc.page.width;

    const subjectColumns = {
      subject: 50,
      score: 320,
      grade: 420,
    };

    doc.fontSize(11);
    doc.font("Helvetica-Bold");

    doc.text(
      "Subject",
      subjectColumns.subject,
      y,
      { width: 250 }
    );

    doc.text(
      "Score",
      subjectColumns.score,
      y,
      { width: 80 }
    );

    doc.text(
      "Grade",
      subjectColumns.grade,
      y,
      { width: 60 }
    );

    y += 20;

    doc
      .moveTo(50, y)
      .lineTo(pageWidth - 50, y)
      .stroke();

    y += 10;

    doc.font("Helvetica");

    result.subjects.forEach(
      (subject) => {
        doc.text(
          subject.subjectName,
          subjectColumns.subject,
          y,
          {
            width: 250,
            ellipsis: true,
          }
        );

        doc.text(
          String(subject.totalScore),
          subjectColumns.score,
          y,
          { width: 80 }
        );

        doc.text(
          subject.grade,
          subjectColumns.grade,
          y,
          { width: 60 }
        );

        y += 22;

        doc
          .moveTo(50, y)
          .lineTo(
            pageWidth - 50,
            y
          )
          .stroke();

        y += 8;
      }
    );

    doc.y = y + 15;

    /**
     * Summary
     */
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Summary");

    doc.moveDown();

    doc.font("Helvetica");

    doc.text(
      `Total Marks: ${result.totalMarks}`
    );

    doc.text(
      `Average Score: ${result.averageScore.toFixed(
        2
      )}`
    );

    doc.text(
      `Overall Grade: ${result.grade}`
    );

    doc.text(
      `Class Position: ${rank.position} / ${rank.outOf}`
    );

    doc.moveDown(2);

    doc.text(
      `Generated On: ${new Date().toLocaleDateString()}`
    );

    doc.end();

    return new Promise(
      (resolve, reject) => {
        stream.on("finish", () =>
          resolve(filePath)
        );

        stream.on(
          "error",
          reject
        );
      }
    );
  }

  /**
   * Generate Class Performance Report
   */
  async generateClassReport(
    classStreamIdOrCode
  ) {
    const streamLookup =
      await db
        .select()
        .from(classStreams)
        .where(
          eq(
            classStreams.streamCode,
            classStreamIdOrCode
          )
        );

    const classStream =
      streamLookup[0];

    const resolvedClassStreamId =
      classStream
        ? classStream.id
        : classStreamIdOrCode;

    const positions =
      await resultsService.getClassPositions(
        resolvedClassStreamId
      );

    const reportsDir = path.join(
      process.cwd(),
      "generated-reports",
      "classes"
    );

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, {
        recursive: true,
      });
    }

    const filePath = path.join(
      reportsDir,
      `${classStreamIdOrCode}-class-report.pdf`
    );

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    const stream =
      fs.createWriteStream(filePath);

    doc.pipe(stream);

    /**
     * Header
     */
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("IKONEX ACADEMY", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .text(
        "CLASS PERFORMANCE REPORT",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        `Class Stream: ${
          classStream?.name ??
          classStreamIdOrCode
        }`
      );

    doc.moveDown(2);

    /**
     * Table
     */
    let y = doc.y;

    const pageWidth = doc.page.width;

    const columns = {
      position: 50,
      admission: 90,
      name: 150,
      total: 340,
      average: 420,
      grade: 480,
    };

    doc.font("Helvetica-Bold");
    doc.fontSize(11);

    doc.text(
      "Pos",
      columns.position,
      y,
      { width: 30 }
    );

    doc.text(
      "Adm No",
      columns.admission,
      y,
      { width: 50 }
    );

    doc.text(
      "Student Name",
      columns.name,
      y,
      { width: 180 }
    );

    doc.text(
      "Total",
      columns.total,
      y,
      { width: 60 }
    );

    doc.text(
      "Avg",
      columns.average,
      y,
      { width: 50 }
    );

    doc.text(
      "Grade",
      columns.grade,
      y,
      { width: 40 }
    );

    y += 20;

    doc
      .moveTo(50, y)
      .lineTo(pageWidth - 50, y)
      .stroke();

    y += 10;

    doc.font("Helvetica");
    doc.fontSize(11);

    positions.forEach(
      (student, index) => {
        if (
          y >
          doc.page.height - 100
        ) {
          doc.addPage();
          y = 60;
        }

        doc.text(
          String(
            student.position ??
              index + 1
          ),
          columns.position,
          y,
          { width: 30 }
        );

        doc.text(
          student.admissionNumber,
          columns.admission,
          y,
          { width: 50 }
        );

        doc.text(
          `${student.firstName} ${student.lastName}`,
          columns.name,
          y,
          {
            width: 180,
            ellipsis: true,
          }
        );

        doc.text(
          String(
            student.totalMarks
          ),
          columns.total,
          y,
          { width: 60 }
        );

        doc.text(
          Number(
            student.averageScore
          ).toFixed(2),
          columns.average,
          y,
          { width: 50 }
        );

        doc.text(
          student.grade,
          columns.grade,
          y,
          { width: 40 }
        );

        y += 22;

        doc
          .moveTo(50, y)
          .lineTo(
            pageWidth - 50,
            y
          )
          .stroke();

        y += 8;
      }
    );

    doc.y = y + 20;

    doc.text(
      `Generated On: ${new Date().toLocaleDateString()}`
    );

    doc.end();

    return new Promise(
      (resolve, reject) => {
        stream.on("finish", () =>
          resolve(filePath)
        );

        stream.on(
          "error",
          reject
        );
      }
    );
  }
}

export default new ReportsService();