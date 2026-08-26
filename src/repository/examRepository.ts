import pool from "../config/db";
import { Exam } from "../model/exam";
import { CreateExamInput, UpdateExamInput } from "../dto/examDto";

function mapExam(row: any): Exam {
    return {
        examId: row.id_exam,
        title: row.title,
        description: row.description,
        courseId: row.id_course,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: row.created_at,
    };
}

export const examRepository = {
    async findAll(): Promise<Exam[]> {
        const result = await pool.query(`SELECT * FROM exams ORDER BY start_date DESC`);
        return result.rows.map(mapExam);
    },

    async findById(examId: number): Promise<Exam | null> {
        const result = await pool.query(`SELECT * FROM exams WHERE id_exam = $1`, [examId]);
        return result.rows[0] ? mapExam(result.rows[0]) : null;
    },

    async create(data: CreateExamInput): Promise<Exam> {
        const result = await pool.query(
            `INSERT INTO exams (title, description, id_course, start_date, end_date)
             VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
            [data.title, data.description || "", data.courseId, data.startDate, data.endDate]
        );
        return mapExam(result.rows[0]);
    },

    async update(examId: number, data: UpdateExamInput): Promise<Exam | null> {
        const result = await pool.query(
            `UPDATE exams SET
                              title = COALESCE($2, title),
                              description = COALESCE($3, description),
                              id_course = COALESCE($4, id_course),
                              start_date = COALESCE($5, start_date),
                              end_date = COALESCE($6, end_date)
             WHERE id_exam = $1
                 RETURNING *`,
            [examId, data.title, data.description, data.courseId, data.startDate, data.endDate]
        );
        return result.rows[0] ? mapExam(result.rows[0]) : null;
    },

    async delete(examId: number): Promise<void> {
        await pool.query(`DELETE FROM exams WHERE id_exam = $1`, [examId]);
    },

    async countSubmissions(examId: number): Promise<number> {
        const result = await pool.query(
            `SELECT id_submission FROM submissions WHERE id_exam = $1`,
            [examId]
        );
        return result.rows.length;
    },
    async getQuestionById(id: number) {
        return pool.query('SELECT * FROM Questions WHERE id_question = $1', [id]);
    }
};