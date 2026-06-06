import { eq } from "drizzle-orm";

import { db } from "#config/database.js";

import { students } from "../students/students.models.js";
import { subjects } from "../subjects/subjects.models.js";
import { assessments } from "../assessments/assessments.models.js";

import gradingScalesService from "../grading-scale/grading-scales.service.js";

class ResultsService {
  /**
   * Calculate subject totals for a student
   */
  async calculateStudentSubjects(admissionNumber) {
    const [student] = await db
      .select()
      .from(students)
      .where(
        eq(
          students.admissionNumber,
          admissionNumber
        )
      );

    if (!student) {
      throw new Error("Student not found");
    }

    const records = await db
      .select({
        subjectId: assessments.subjectId,
        subjectCode: subjects.subjectCode,
        subjectName: subjects.name,
        score: assessments.score,
      })
      .from(assessments)
      .innerJoin(
        subjects,
        eq(
          assessments.subjectId,
          subjects.id
        )
      )
      .where(
        eq(
          assessments.studentId,
          student.id
        )
      );

    const grouped = {};

    for (const record of records) {
      if (!grouped[record.subjectCode]) {
        grouped[record.subjectCode] = {
          subjectId: record.subjectId,
          subjectCode: record.subjectCode,
          subjectName: record.subjectName,
          totalScore: 0,
        };
      }

      grouped[
        record.subjectCode
      ].totalScore += Number(
        record.score
      );
    }

    const subjectResults = [];

    for (const subject of Object.values(
      grouped
    )) {
      const gradingScale =
        await gradingScalesService.findGrade(
          subject.totalScore
        );

      subjectResults.push({
        ...subject,
        grade:
          gradingScale?.grade ??
          null,
        remarks:
          gradingScale?.remarks ??
          null,
      });
    }

    return {
      student,
      subjects: subjectResults,
    };
  }

  /**
   * Student result
   */
  async getStudentResult(
    admissionNumber
  ) {
    const result =
      await this.calculateStudentSubjects(
        admissionNumber
      );

    const totalMarks =
      result.subjects.reduce(
        (sum, subject) =>
          sum +
          subject.totalScore,
        0
      );

    const averageScore =
      result.subjects.length > 0
        ? totalMarks /
          result.subjects.length
        : 0;

    const overallGrade =
      await gradingScalesService.findGrade(
        averageScore
      );

    return {
      student: {
        id:
          result.student.id,

        admissionNumber:
          result.student
            .admissionNumber,

        firstName:
          result.student
            .firstName,

        lastName:
          result.student
            .lastName,

        classStreamId:
          result.student
            .classStreamId,
      },

      subjects:
        result.subjects,

      totalMarks,

      averageScore,

      grade:
        overallGrade?.grade ??
        null,

      remarks:
        overallGrade?.remarks ??
        null,
    };
  }

  /**
   * Get all results for a class stream
   */
  async getClassResults(
    classStreamId
  ) {
    const classStudents =
      await db
        .select()
        .from(students)
        .where(
          eq(
            students.classStreamId,
            classStreamId
          )
        );

    const results = [];

    for (const student of classStudents) {
      const result =
        await this.getStudentResult(
          student.admissionNumber
        );

      results.push(result);
    }

    return results;
  }

  /**
   * Overall class ranking
   */
  async getClassPositions(
    classStreamId
  ) {
    const results =
      await this.getClassResults(
        classStreamId
      );

    const ranked =
      results.sort(
        (a, b) =>
          b.totalMarks -
          a.totalMarks
      );

    return ranked.map(
      (student, index) => ({
        position:
          index + 1,

        admissionNumber:
          student.student
            .admissionNumber,

        firstName:
          student.student
            .firstName,

        lastName:
          student.student
            .lastName,

        totalMarks:
          student.totalMarks,

        averageScore:
          student.averageScore,

        grade:
          student.grade,
      })
    );
  }

  /**
   * Subject ranking
   */
  async getSubjectPositions(
    classStreamId,
    subjectCode
  ) {
    const classStudents =
      await db
        .select()
        .from(students)
        .where(
          eq(
            students.classStreamId,
            classStreamId
          )
        );

    const rankings = [];

    for (const student of classStudents) {
      const result =
        await this.calculateStudentSubjects(
          student.admissionNumber
        );

      const subject =
        result.subjects.find(
          (s) =>
            s.subjectCode ===
            subjectCode
        );

      if (subject) {
        rankings.push({
          admissionNumber:
            student.admissionNumber,

          firstName:
            student.firstName,

          lastName:
            student.lastName,

          score:
            subject.totalScore,
        });
      }
    }

    rankings.sort(
      (a, b) =>
        b.score - a.score
    );

    return rankings.map(
      (student, index) => ({
        position:
          index + 1,

        ...student,
      })
    );
  }

  /**
   * Student rank in class
   */
  async getStudentRank(
    admissionNumber
  ) {
    const [student] = await db
      .select()
      .from(students)
      .where(
        eq(
          students.admissionNumber,
          admissionNumber
        )
      );

    if (!student) {
      throw new Error(
        "Student not found"
      );
    }

    const rankings =
      await this.getClassPositions(
        student.classStreamId
      );

    const rank =
      rankings.find(
        (studentRank) =>
          studentRank.admissionNumber ===
          admissionNumber
      );

    return {
      position:
        rank?.position ?? null,

      outOf:
        rankings.length,
    };
  }
}

export default new ResultsService();