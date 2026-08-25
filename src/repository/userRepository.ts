import pool from '../config/db';
import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO
} from '../model/user';

export class UserRepository {

  async findStudents(): Promise<Student[]> {
    const result = await pool.query(
      `SELECT
        id_user,
        first_name,
        last_name as name,
        mail as email,
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
        id_user,
        first_name,
        last_name as name,
        mail as email,
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
        id_user,
        first_name,
        last_name as name,
        mail as email,
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

  async createStudent(data: CreateStudentDTO): Promise<Student> {
    const result = await pool.query(
      `INSERT INTO users (
        first_name,
        last_name,
        mail,
        password,
        role,
        status,
        created_at
      )
      VALUES ($1, $2, $3, $4, 'ETUDIANT', 'ACTIF', NOW())
      RETURNING *`,
      [
        data.firstName,
        data.name,
        data.email,
        data.password
      ]
    );

    return result.rows[0];
  }

  async updateStudent(
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

    if (data.name !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(data.name);
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
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async deactivateStudent(id: number): Promise<Student | null> {
    const result = await pool.query(
      `UPDATE users
       SET status = 'DESACTIVE'
       WHERE id_user = $1
       AND role = 'ETUDIANT'
       RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  }
}