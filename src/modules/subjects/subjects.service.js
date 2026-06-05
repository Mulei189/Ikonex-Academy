import { sql } from "#config/database.js";

import {
  subjects,
} from "./subjects.models.js";

class SubjectsService {
    // CRUD operations for subjects
    
  async create(data) {
    const existingSubject = await sql`
      SELECT id FROM subjects WHERE code = ${data.subjectCode} LIMIT 1
    `;

    if (existingSubject.length > 0) {
      throw new Error(
        "Subject code already exists"
      );
    }

    const result = await sql`
      INSERT INTO subjects (code, name, created_at, updated_at)
      VALUES (${data.subjectCode}, ${data.name}, now(), now())
      RETURNING id, code, name, created_at, updated_at
    `;

    return result[0];
  }

  //   Get all subjects
  async getAll() {
    return await sql`
      SELECT id, code, name, created_at, updated_at
      FROM subjects
      ORDER BY created_at DESC
    `;
  }

  //   Get subject by subject code
  async getBySubjectCode(subjectCode) {
    const result = await sql`
      SELECT id, code, name, created_at, updated_at
      FROM subjects
      WHERE code = ${subjectCode}
      LIMIT 1
    `;

    return result[0] || null;
  }

  //   update subject by subject code
  async update(subjectCode, data) {
    const result = await sql`
      UPDATE subjects
      SET 
        name = ${data.name || data.subjectName},
        updated_at = now()
      WHERE code = ${subjectCode}
      RETURNING id, code, name, created_at, updated_at
    `;

    return result[0] || null;
  }

  //   delete subject by subject code
  async delete(subjectCode) {
    const result = await sql`
      DELETE FROM subjects
      WHERE code = ${subjectCode}
      RETURNING id, code, name, created_at, updated_at
    `;

    return result[0] || null;
  }

  //   assign subject to class stream
  async assignToClassStream(data) {
    const {
      classStreamId,
      subjectCode,
    } = data;

    const stream = await sql`
      SELECT id FROM class_streams WHERE id = ${classStreamId} LIMIT 1
    `;

    if (stream.length === 0) {
      throw new Error(
        "Class stream not found"
      );
    }

    const subject = await sql`
      SELECT id FROM subjects WHERE code = ${subjectCode} LIMIT 1
    `;

    if (!subject || subject.length === 0) {
      throw new Error(
        "Subject not found"
      );
    }

    const existingAssignment = await sql`
      SELECT id FROM class_stream_subjects 
      WHERE class_stream_id = ${classStreamId} AND subject_id = ${subject[0].id}
      LIMIT 1
    `;

    if (existingAssignment.length > 0) {
      throw new Error(
        "Subject already assigned to class stream"
      );
    }

    const result = await sql`
      INSERT INTO class_stream_subjects (class_stream_id, subject_id)
      VALUES (${classStreamId}, ${subject[0].id})
      RETURNING id, class_stream_id, subject_id, created_at, updated_at
    `;

    return result[0];
  }

  //   get subjects by class stream
  async getSubjectsByClassStream(classStreamId) {
    return await sql`
      SELECT 
        s.id,
        s.code,
        s.name
      FROM class_stream_subjects css
      INNER JOIN subjects s ON css.subject_id = s.id
      WHERE css.class_stream_id = ${classStreamId}
      ORDER BY s.name
    `;
  }
}

export default new SubjectsService();