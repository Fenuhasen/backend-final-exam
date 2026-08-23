import pool from "../config/db";
import { SubmissionDTO } from "../dto/submissionDto";

const SubmissionRepository = {
    createSubmission(submission: SubmissionDTO) {
        return pool.query('INSERT INTO submissions (id_exam, id_student, submitted_at) VALUES ($1, $2, now()) RETURNING *', [submission.id_exam, submission.id_student]);
    }
};

export { SubmissionRepository };