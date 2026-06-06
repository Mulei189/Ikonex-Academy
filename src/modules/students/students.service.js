import { eq } from "drizzle-orm";
import logger from "#config/logger.js";

import { db } from "#config/database.js";

import { students } from "./students.models.js";
import { classStreams } from "../class-streams/class-streams.models.js";

class StudentsService {
  async create(data) {
    // Check admission number uniqueness
    const existingStudent = await db
      .select()
      .from(students)
      .where(
        eq(students.admissionNumber, data.admissionNumber)
      );

    if (existingStudent.length > 0) {
      throw new Error("Admission number already exists");
    }

    // Check class stream exists
    const existingClassStream = await db
      .select()
      .from(classStreams)
      .where(
        eq(classStreams.id, data.classStreamId));

    if (existingClassStream.length === 0) {
      throw new Error("Class stream not found");
    }

    const [student] = await db
      .insert(students)
      .values(data)
      .returning();
    logger.info(`Student created with ID: ${student.id}`);
    return student;
  }

//   Get all students
  async getAll() {
    return await db
      .select()
      .from(students);
      logger.info(`Fetched all students`);
  }

//   Get student by ID
  async getById(id) {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, id));
    logger.info(`Fetched student with ID: ${student.id}`);

    return student;
  }

//   Get student by admission number
  async getByAdmissionNumber(admissionNumber) {
    console.log("SEARCHING FOR:", admissionNumber); // Debug log to verify input
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.admissionNumber, admissionNumber));
     
    logger.info(`Fetched student with admission number: ${student.admissionNumber}`);
    console.log("RESULT:", student); // Debug log to verify output
    return student;
  }

//   Get student by class stream
  async getByClassStream(classStreamIdOrCode) {
    // Try to resolve the parameter as a stream code first
    const classStream = await db
      .select()
      .from(classStreams)
      .where(eq(classStreams.streamCode, classStreamIdOrCode));

    // If not found as a code, assume it's a UUID and use it directly
    const streamId = classStream.length > 0 ? classStream[0].id : classStreamIdOrCode;

    const students_result = await db
      .select()
      .from(students)
      .where(eq(students.classStreamId, streamId));
    
    logger.info(`Fetched students with class stream: ${classStreamIdOrCode}`);
    return students_result;
  }

//   Update student by admission number
  async update(admissionNumber, data) {
    const [student] = await db
      .update(students)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(students.admissionNumber, admissionNumber))
      .returning();
    logger.info(`Student with admission number: ${admissionNumber} updated`);
    return student;
  }

//   Delete student by admission number
  async delete(admissionNumber) {
    const [student] = await db
      .delete(students)
      .where(eq(students.admissionNumber, admissionNumber))
      .returning();
    logger.info(`Student with admission number: ${admissionNumber} deleted`);
    return student;
  }
}

export default new StudentsService();