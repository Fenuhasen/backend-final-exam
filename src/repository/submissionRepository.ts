import pool from "../config/db";
import { SubmissionDTO } from "../dto/submissionDto";

const SubmissionRepository = {
    async createSubmission(submission: SubmissionDTO) {
        const result = await pool.query(
            `INSERT INTO submissions (id_exam, id_student, submitted_at) VALUES ($1, $2, NOW()) RETURNING *`, [submission.id_exam, submission.id_student]
        );
        const idSubmission = result.rows[0].id_submission;
        for (const item of submission.items) {
            await pool.query(
                `INSERT INTO submission_items (id_submission, id_question, id_choice) VALUES ($1, $2, $3)`, [idSubmission, item.id_question, item.id_choice]
            );
        }

        return result;
    },
    findAll() {
        return pool.query('SELECT * FROM submissions');
    },
    findByExamId(idExam: number) {
        return pool.query('SELECT * FROM submissions WHERE id_exam = $1', [idExam])
    },
    findByStudentID(idStudent: number) {
        return pool.query('SELECT * FROM submissions WHERE id_student = $1', [idStudent])
    }
};

export { SubmissionRepository };