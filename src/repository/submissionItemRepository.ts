import pool from "../config/db"

const SubmissionItemRepository = {
    findBySubmissionId(id: number){
        return pool.query('SELECT * FROM submission_items WHERE id_submission = $1', [id]);
    }
}

export default SubmissionItemRepository