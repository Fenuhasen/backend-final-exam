import pool from '../config/db';
import { Course, CreateCourseInput, UpdateCourseInput } from '../model/course';

export const CourseRepository = {
  async findAll(): Promise<Course[]> {
    const result = await pool.query(
      'SELECT id_course, code, name, description FROM courses ORDER BY id_course'
    );

    return result.rows;
  },

  async findById(id: number): Promise<Course | null> {
    const result = await pool.query(
      'SELECT id_course, code, name, description FROM courses WHERE id_course = $1',
      [id]
    );

    return result.rows[0] || null;
  },

  async create(data: CreateCourseInput): Promise<Course> {
    const result = await pool.query(
      `INSERT INTO courses (code, name, description)
       VALUES ($1, $2, $3)
       RETURNING id_course, code, name, description`,
      [data.code, data.name, data.description ?? '']
    );

    return result.rows[0];
  },

  async update(id: number, data: UpdateCourseInput): Promise<Course | null> {
    const result = await pool.query(
      `UPDATE courses
       SET code = COALESCE($1, code),
           name = COALESCE($2, name),
           description = COALESCE($3, description)
       WHERE id_course = $4
       RETURNING id_course, code, name, description`,
      [data.code, data.name, data.description, id]
    );

    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM courses WHERE id_course = $1',
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  },
};
