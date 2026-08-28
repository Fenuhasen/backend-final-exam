import pool from '../config/db';
import { StudentDTO } from '../dto/userDto';
import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO
} from '../model/user';

export const UserRepository = {

  async findUserForLogin(email: string): Promise<(Student & { role: string }) | null> {
    const result = await pool.query(
      `SELECT id_user, first_name, last_name as name, mail as email,
              password, role, status, created_at
       FROM users
       WHERE mail = $1`,
      [email]
    );
    return result.rows[0] || null;
  },

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
  },

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
  },

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
      WHERE mail = $1
       AND role = 'ETUDIANT'`,
      [email]
    );

    return result.rows[0] || null;
  },

  async createStudent(data: CreateStudentDTO): Promise<StudentDTO> {
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
      RETURNING id_user as id, first_name || ' ' || last_name as name,
            mail as email, status = 'ACTIF' as is_active, created_at`,
      [
        data.first_name,
        data.last_name,
        data.email,
        data.password
      ]
    );

    return result.rows[0];
  }
  ,
  async updateStudent(
    id: number,
    data: UpdateStudentDTO
  ): Promise<StudentDTO | null> {

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
      updates.push(`mail = $${paramCount++}`);
      values.push(data.email);
    }

    if (data.password !== undefined) {
      updates.push(`password = $${paramCount++}`);
      values.push(data.password);
    }

    if (updates.length === 0) {
      const student = await this.findById(id);
      return student
        ? {
          id: student.id_user,
          name: `${student.first_name} ${student.name}`,
          email: student.email,
          is_active: student.status === 'ACTIF',
          created_at: student.created_at
        }
        : null;
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id_user = $${paramCount}
       AND role = 'ETUDIANT'
      RETURNING id_user as id, first_name || ' ' || last_name as name,
            mail as email, status = 'ACTIF' as is_active, created_at`,
      values
    );

    return result.rows[0] || null;
  }
  ,
  async toggleStudentStatus(
    id: number,
    currentStatus: string
  ): Promise<StudentDTO | null> {
    const result = await pool.query(
      `UPDATE users
       SET status = $1
      WHERE id_user = $2
       AND role = 'ETUDIANT'
      RETURNING id_user as id, first_name || ' ' || last_name as name,
           mail as email, status = 'ACTIF' as is_active, created_at`,
      [currentStatus === 'ACTIF' ? 'DESACTIVE' : 'ACTIF', id]
    );

    return result.rows[0] || null;
  }
}