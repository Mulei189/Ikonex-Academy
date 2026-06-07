import { and, eq } from "drizzle-orm";
import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { assessments } from "./assessments.models.js";
import { students } from "../students/students.models.js";
import { subjects } from "../subjects/subjects.models.js";
import { sql } from "#config/database.js";
import gradingScalesService from "../grading-scale/grading-scales.service.js";

// AssessmentsService class to handle business logic for assessments
class AssessmentsService {
  
  // Calculate weighted mean for a student's assessments in a subject
  // Weights: CAT1 = 15%, CAT2 = 15%, MIDTERM = 20%, ENDTERM = 50%
  calculateWeightedMean(assessments) {
    const weights = {
      CAT1: 0.15,
      CAT2: 0.15,
      MIDTERM: 0.20,
      ENDTERM: 0.50
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessments.forEach(assessment => {
      const weight = weights[assessment.assessmentType] || 0;
      totalWeightedScore += assessment.score * weight;
      totalWeight += weight;
    });

    // If no assessments found, return null
    if (totalWeight === 0) return null;

    // Return weighted mean rounded to 2 decimal places
    return Math.round((totalWeightedScore / totalWeight) * 100) / 100;
  }

  // Record assessment score for a student
  async create(data) {
    const {
      admissionNumber,
      subjectCode,
      assessmentType,
      score,
    } = data;

    // Find student by admission number
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.admissionNumber, admissionNumber));

    if (!student) {
      throw new Error("Student not found");
    }

    // Find subject by subject code
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.subjectCode, subjectCode));

    if (!subject) {
      throw new Error("Subject not found");
    }

    // Validate that subject is assigned to student's class stream
    const classStreamSubject = await sql`
      SELECT id FROM class_stream_subjects 
      WHERE class_stream_id = ${student.classStreamId} AND subject_id = ${subject.id}
      LIMIT 1
    `;

    if (classStreamSubject.length === 0) {
      throw new Error("Subject is not assigned to this student's class stream");
    }

    // Prevent duplicate assessments for the same student, subject, and assessment type
    const existingAssessment = await db
      .select()
      .from(assessments)
      .where(
        and(
          eq(assessments.studentId, student.id),
          eq(assessments.subjectId, subject.id),
          eq(assessments.assessmentType, assessmentType)
        )
      );

    if (existingAssessment.length > 0) {
      throw new Error("Assessment score already recorded for this student, subject, and assessment type");
    }

    // Create new assessment
    const [assessment] = await db
      .insert(assessments)
      .values({
        studentId: student.id,
        subjectId: subject.id,
        assessmentType,
        score,
      })
      .returning();

    logger.info(`Assessment created for student ${admissionNumber} in subject ${subjectCode}`);
    return assessment;
  }

  // Update assessment score
  async update(id, data) {
    const [assessment] = await db
      .update(assessments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id))
      .returning();

    logger.info(`Assessment updated with ID: ${id}`);
    return assessment;
  }

  // Delete assessment
  async delete(id) {
    const [assessment] = await db
      .delete(assessments)
      .where(eq(assessments.id, id))
      .returning();

    logger.info(`Assessment deleted with ID: ${id}`);
    return assessment;
  }

  // Get student performance across all subjects with weighted mean calculation
  async getStudentPerformance(admissionNumber) {
    // Find student by admission number
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.admissionNumber, admissionNumber));

    if (!student) {
      throw new Error("Student not found");
    }

    // Fetch all assessments for the student
    const performanceData = await db
      .select({
        id: assessments.id,
        subjectCode: subjects.subjectCode,
        subjectName: subjects.name,
        assessmentType: assessments.assessmentType,
        score: assessments.score,
      })
      .from(assessments)
      .innerJoin(subjects, eq(assessments.subjectId, subjects.id))
      .where(eq(assessments.studentId, student.id));

    // Group assessments by subject
    const groupedBySubject = {};
    performanceData.forEach(item => {
      if (!groupedBySubject[item.subjectCode]) {
        groupedBySubject[item.subjectCode] = {
          subjectCode: item.subjectCode,
          subjectName: item.subjectName,
          assessments: []
        };
      }
      groupedBySubject[item.subjectCode].assessments.push({
        assessmentType: item.assessmentType,
        score: item.score
      });
    });

    // Calculate weighted mean for each subject and add grade information
    const performanceWithWeightedMean = await Promise.all(
      Object.values(groupedBySubject).map(async (subjectData) => {
        const weightedMean = this.calculateWeightedMean(subjectData.assessments);
        
        // Get grade for weighted mean
        let grade = null;
        let remarks = null;
        if (weightedMean !== null) {
          try {
            const gradeInfo = await gradingScalesService.findGrade(weightedMean);
            grade = gradeInfo ? gradeInfo.grade : null;
            remarks = gradeInfo ? gradeInfo.remarks : null;
          } catch (error) {
            logger.error('Error fetching grade:', error);
          }
        }

        return {
          subjectCode: subjectData.subjectCode,
          subjectName: subjectData.subjectName,
          assessments: subjectData.assessments,
          weightedMean,
          grade,
          remarks
        };
      })
    );

    logger.info(`Fetched student performance for admission number: ${admissionNumber}`);
    return performanceWithWeightedMean;
  }


  // Get student performance for a specific subject with weighted mean calculation
  async getStudentSubjectPerformance(admissionNumber, subjectCode) {
    // Find student by admission number
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.admissionNumber, admissionNumber));

    if (!student) {
      throw new Error("Student not found");
    }

    // Find subject by subject code
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.subjectCode, subjectCode));

    if (!subject) {
      throw new Error("Subject not found");
    }

    // Fetch assessments for the student in the specific subject
    const performanceData = await db
      .select({
        id: assessments.id,
        assessmentType: assessments.assessmentType,
        score: assessments.score,
        subjectCode: subjects.subjectCode,
        subjectName: subjects.name,
      })
      .from(assessments)
      .innerJoin(subjects, eq(assessments.subjectId, subjects.id))
      .where(
        and(
          eq(assessments.studentId, student.id),
          eq(assessments.subjectId, subject.id)
        )
      );

    // Calculate weighted mean for the subject
    const weightedMean = this.calculateWeightedMean(performanceData);

    // Add grade information from grading scale
    let grade = null;
    let remarks = null;
    if (weightedMean !== null) {
      try {
        const gradeInfo = await gradingScalesService.findGrade(weightedMean);
        grade = gradeInfo ? gradeInfo.grade : null;
        remarks = gradeInfo ? gradeInfo.remarks : null;
      } catch (error) {
        logger.error('Error fetching grade:', error);
      }
    }

    const result = {
      subjectCode: subject.subjectCode,
      subjectName: subject.name,
      assessments: performanceData,
      weightedMean,
      grade,
      remarks
    };

    logger.info(`Fetched student subject performance for admission number: ${admissionNumber}, subject: ${subjectCode}`);
    return result;
  }

  // Get class performance for a specific subject with weighted mean calculation
  async getClassPerformance(classStreamId, subjectCode) {
    // Find subject by subject code
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.subjectCode, subjectCode));

    if (!subject) {
      throw new Error("Subject not found");
    }

    // Fetch all students in the class stream and their assessments for the subject
    const performanceData = await db
      .select({
        admissionNumber: students.admissionNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        assessmentType: assessments.assessmentType,
        score: assessments.score,
        id: assessments.id,
      })
      .from(assessments)
      .innerJoin(students, eq(assessments.studentId, students.id))
      .where(
        and(
          eq(students.classStreamId, classStreamId),
          eq(assessments.subjectId, subject.id)
        )
      );

    // Group assessments by student
    const groupedByStudent = {};
    performanceData.forEach(item => {
      if (!groupedByStudent[item.admissionNumber]) {
        groupedByStudent[item.admissionNumber] = {
          admissionNumber: item.admissionNumber,
          firstName: item.firstName,
          lastName: item.lastName,
          assessments: []
        };
      }
      groupedByStudent[item.admissionNumber].assessments.push({
        assessmentType: item.assessmentType,
        score: item.score
      });
    });

    // Calculate weighted mean for each student and add grade information
    const performanceWithWeightedMean = await Promise.all(
      Object.values(groupedByStudent).map(async (studentData) => {
        const weightedMean = this.calculateWeightedMean(studentData.assessments);
        
        // Get grade for weighted mean
        let grade = null;
        let remarks = null;
        if (weightedMean !== null) {
          try {
            const gradeInfo = await gradingScalesService.findGrade(weightedMean);
            grade = gradeInfo ? gradeInfo.grade : null;
            remarks = gradeInfo ? gradeInfo.remarks : null;
          } catch (error) {
            logger.error('Error fetching grade:', error);
          }
        }

        return {
          admissionNumber: studentData.admissionNumber,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          assessments: studentData.assessments,
          weightedMean,
          grade,
          remarks
        };
      })
    );

    logger.info(`Fetched class performance for class stream ID: ${classStreamId}, subject: ${subjectCode}`);
    return performanceWithWeightedMean;
  }

  // Get class performance comparison across all classes for a specific subject
  async getClassPerformanceComparison(subjectCode) {
    // Find subject by subject code
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.subjectCode, subjectCode));

    if (!subject) {
      throw new Error("Subject not found");
    }

    // Fetch all class streams
    const classStreams = await sql`
      SELECT id, name, stream_code 
      FROM class_streams 
      ORDER BY name, stream_code
    `;

    // Calculate performance for each class stream
    const classPerformance = await Promise.all(
      classStreams.map(async (classStream) => {
        const performance = await this.getClassPerformance(classStream.id, subjectCode);
        
        // Calculate class mean (average of all students' weighted means)
        const validScores = performance
          .filter(p => p.weightedMean !== null)
          .map(p => p.weightedMean);
        
        const classMean = validScores.length > 0
          ? Math.round((validScores.reduce((sum, score) => sum + score, 0) / validScores.length) * 100) / 100
          : null;

        return {
          classStreamId: classStream.id,
          streamName: classStream.name,
          streamCode: classStream.stream_code,
          studentCount: performance.length,
          classMean,
          students: performance
        };
      })
    );

    // Sort by class mean (descending)
    classPerformance.sort((a, b) => {
      if (a.classMean === null && b.classMean === null) return 0;
      if (a.classMean === null) return 1;
      if (b.classMean === null) return -1;
      return b.classMean - a.classMean;
    });

    // Add ranking
    classPerformance.forEach((classData, index) => {
      classData.rank = index + 1;
    });

    logger.info(`Fetched class performance comparison for subject: ${subjectCode}`);
    return classPerformance;
  }

  // Get assessment by ID
  async getById(id) {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id));

    return assessment;
  }

  // Get all assessments
  async getAll() {
    const allAssessments = await db
      .select()
      .from(assessments);

    return allAssessments;
  }
}

export default new AssessmentsService();
