import pool from "../config/db";
import { SubmissionDTO } from "../dto/submissionDto";

const SubmissionRepository = {
    createSubmission(submission: SubmissionDTO) {
        return pool.query('INSERT INTO submissions (id_exam, id_student, submitted_at) VALUES ($1, $2, now()) RETURNING *', [submission.id_exam, submission.id_student]);
    },
    findAll(){
        return pool.query('SELECT * FROM submissions');
    },
    findByExamId(idExam: number){
        return pool.query('SELECT * FROM submissions WHERE id_exam = $1', [idExam])
    },
    findByStudentID(idStudent: number){
        return pool.query('SELECT * FROM submissions WHERE id_student = $1', [idStudent])
    }
};

export { SubmissionRepository };