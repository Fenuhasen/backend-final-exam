import pool from "../config/db";
import { SubmissionDTO } from "../dto/submissionDto";

const SubmissionRepository = {
    async createSubmission(submission: SubmissionDTO) {
        const result = await pool.query(
            `INSERT INTO submissions (id_exam, id_student, submitted_at) VALUES ($1, $2, NOW()) RETURNING *`, [submission.id_exam, submission.id_student]
        );
        const idSubmission = result.rows[0].id_submission;
        for (const item of submission.answers) {
            await pool.query(
                `INSERT INTO submission_items (id_submission, id_question, id_choice) VALUES ($1, $2, $3)`, [idSubmission, item.question_id, item.choice_id]
            );
        }

        return result;
    },
    findById(id: number){
        return pool.query('SELECT * FROM submissions WHERE id_submission = $1', [id]);
    },
    findAll() {
        return pool.query('SELECT * FROM submissions');
    },
    findByExamId(idExam: number) {
        return pool.query('SELECT * FROM submissions WHERE id_exam = $1', [idExam])
    },
    findByExamWithStudents(idExam: number) {
        return pool.query(
            `SELECT s.id_student,
                    COALESCE(SUM(CASE WHEN c.is_correct THEN q.points ELSE 0 END), 0) AS score,
                    s.submitted_at,
                    u.first_name,
                    u.last_name
             FROM submissions s
             JOIN users u ON u.id_user = s.id_student
             LEFT JOIN submission_items si ON si.id_submission = s.id_submission
             LEFT JOIN choices c ON c.id_choice = si.id_choice
             LEFT JOIN questions q ON q.id_question = si.id_question
             WHERE s.id_exam = $1
             GROUP BY s.id_submission, s.id_student, s.submitted_at, u.first_name, u.last_name
             ORDER BY s.submitted_at ASC`,
            [idExam]
        );
    },
    findByStudentID(idStudent: number) {
        return pool.query('SELECT * FROM submissions WHERE id_student = $1', [idStudent])
    }
};

export { SubmissionRepository };