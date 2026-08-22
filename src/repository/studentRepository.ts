import pool from '../config/db';
import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO
} from '../model/student';

export class StudentRepository {

  async findAll(): Promise<Student[]> {
    const result = await pool.query(
      `SELECT
        id_user AS id,
        first_name,
        last_name,
        email,
        role,
        status,
        created_at
       FROM users
       WHERE role = 'ETUDIANT'
       ORDER BY created_at DESC`
    );

    return result.rows;
  }

  async findById(id: number): Promise<Student | null> {
    const result = await pool.query(
      `SELECT
        id_user AS id,
        first_name,
        last_name,
        email,
        role,
        status,
        created_at
       FROM users
       WHERE id_user = $1
       AND role = 'ETUDIANT'`,
      [id]
    );

    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const result = await pool.query(
      `SELECT
        id_user AS id,
        first_name,
        last_name,
        email,
        role,
        status,
        created_at
       FROM users
       WHERE email = $1
       AND role = 'ETUDIANT'`,
      [email]
    );

    return result.rows[0] || null;
  }

  async create(data: CreateStudentDTO): Promise<Student> {
    const result = await pool.query(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        role,
        status,
        created_at
      )
      VALUES ($1, $2, $3, $4, 'ETUDIANT', 'ACTIF', NOW())
      RETURNING
        id_user AS id,
        first_name,
        last_name,
        email,
        role,
        status,
        created_at`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.password
      ]
    );

    return result.rows[0];
  }

  async update(
    id: number,
    data: UpdateStudentDTO
  ): Promise<Student | null> {

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.firstName !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(data.firstName);
    }

    if (data.lastName !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(data.lastName);
    }

    if (data.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(data.email);
    }

    if (data.password !== undefined) {
      updates.push(`password = $${paramCount++}`);
      values.push(data.password);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id_user = $${paramCount}
       AND role = 'ETUDIANT'
       RETURNING
         id_user AS id,
         first_name,
         last_name,
         email,
         role,
         status,
         created_at`,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<Student | null> {
    const result = await pool.query(
      `UPDATE users
       SET status = 'DESACTIVE'
       WHERE id_user = $1
       AND role = 'ETUDIANT'
       RETURNING
         id_user AS id,
         first_name,
         last_name,
         email,
         role,
         status,
         created_at`,
      [id]
    );

    return result.rows[0] || null;
  }

  async findMyExams(studentId: number) {
    const result = await pool.query(
      `SELECT
        e.id_exam AS id,
        e.title AS titre,
        e.id_course AS id_cours,
        e.start_date AS "dateDebut",
        e.end_date AS "dateFin"
       FROM exams e
       WHERE e.end_date >= NOW()
       ORDER BY e.start_date ASC`
    );

    return result.rows;
  }

  async findMyExamById(
    studentId: number,
    examId: number
  ) {
    const result = await pool.query(
      `SELECT
        e.id_exam AS id,
        e.title AS titre,
        e.id_course AS id_cours,
        e.start_date AS "dateDebut",
        e.end_date AS "dateFin"
       FROM exams e
       WHERE e.id_exam = $1`,
      [examId]
    );

    return result.rows[0] || null;
  }
  async findMyResults(studentId: number) {
    const result = await pool.query(
      `SELECT
        s.id_submission AS id,
        s.id_exam AS id_examen,
        s.submitted_at AS "submittedAt"
       FROM submissions s
       WHERE s.id_student = $1
       ORDER BY s.submitted_at DESC`,
      [studentId]
    );

    return result.rows;
  }
  async findExamResults(examId: number) {
    const result = await pool.query(
      `SELECT
        s.id_submission AS id,
        s.id_student AS id_etudiant,
        u.first_name,
        u.last_name,
        s.submitted_at AS "submittedAt"
       FROM submissions s
       JOIN users u
         ON u.id_user = s.id_student
       WHERE s.id_exam = $1
       ORDER BY s.submitted_at DESC`,
      [examId]
    );

    return result.rows;
  }
}