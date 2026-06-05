import { and, eq } from "drizzle-orm";

import { db } from "#config/database.js";

import { assessments } from "./assessments.models.js";

import { students } from "../students/students.models.js";
import { subjects } from "../subjects/subjects.models.js";

// 
class AssessmentsService {
  
//    Record score
    async create(data) {
        const {
        admissionNumber,
        subjectCode,
        assessmentType,
        score,
        } = data;

        // Find student
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

        // Find subject
        const [subject] = await db
        .select()
        .from(subjects)
        .where(
            eq(
            subjects.subjectCode,
            subjectCode
            )
        );

        if (!subject) {
        throw new Error(
            "Subject not found"
        );
        }

        // Prevent duplicates
        const existingAssessment =
        await db
            .select()
            .from(assessments)
            .where(
            and(
                eq(
                assessments.studentId,
                student.id
                ),
                eq(
                assessments.subjectId,
                subject.id
                ),
                eq(
                assessments.assessmentType,
                assessmentType
                )
            )
            );

        if (
        existingAssessment.length > 0
        ) {
        throw new Error(
            "Assessment score already recorded"
        );
        }

        const [assessment] =
        await db
            .insert(assessments)
            .values({
            studentId: student.id,
            subjectId: subject.id,
            assessmentType,
            score,
            })
            .returning();

        return assessment;
  }

  
    // Update score
  async update(id, data) {
    const [assessment] =
      await db
        .update(assessments)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          eq(
            assessments.id,
            id
          )
        )
        .returning();

    return assessment;
  }

  
    // Delete score
  async delete(id) {
    const [assessment] =
      await db
        .delete(assessments)
        .where(
          eq(
            assessments.id,
            id
          )
        )
        .returning();

    return assessment;
  }

  
    // Student performance
     async getStudentPerformance(
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

    return await db
      .select({
        id: assessments.id,
        subjectCode:
          subjects.subjectCode,
        subjectName:
          subjects.name,
        assessmentType:
          assessments.assessmentType,
        score:
          assessments.score,
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
  }


    // Student performance by subject
     async getStudentSubjectPerformance(
    admissionNumber,
    subjectCode
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

    const [subject] = await db
      .select()
      .from(subjects)
      .where(
        eq(
          subjects.subjectCode,
          subjectCode
        )
      );

    if (!subject) {
      throw new Error(
        "Subject not found"
      );
    }

    return await db
      .select({
        assessmentType:
          assessments.assessmentType,
        score:
          assessments.score,
      })
      .from(assessments)
      .where(
        and(
          eq(
            assessments.studentId,
            student.id
          ),
          eq(
            assessments.subjectId,
            subject.id
          )
        )
      );
  }

  
    // Class performance by subject
  async getClassPerformance(
    classStreamId,
    subjectCode
  ) {
    const [subject] = await db
      .select()
      .from(subjects)
      .where(
        eq(
          subjects.subjectCode,
          subjectCode
        )
      );

    if (!subject) {
      throw new Error(
        "Subject not found"
      );
    }

    return await db
      .select({
        admissionNumber:
          students.admissionNumber,

        firstName:
          students.firstName,

        lastName:
          students.lastName,

        assessmentType:
          assessments.assessmentType,

        score:
          assessments.score,
      })
      .from(assessments)
      .innerJoin(
        students,
        eq(
          assessments.studentId,
          students.id
        )
      )
      .where(
        and(
          eq(
            students.classStreamId,
            classStreamId
          ),
          eq(
            assessments.subjectId,
            subject.id
          )
        )
      );
  }

  async getById(id) {
    const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, id));

    return assessment;
    }
}

export default new AssessmentsService();