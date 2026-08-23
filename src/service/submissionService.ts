import { SubmissionDTO } from "../dto/submissionDto";
import SubmissionItemRepository from "../repository/subMissionItemRepository";
import { SubmissionRepository } from "../repository/submissionRepository";

const SubmissionService = {
    createSubmission(submission: SubmissionDTO) {
        return SubmissionRepository.createSubmission(submission);
    },
    async findAll() {
        const sub = await SubmissionRepository.findAll();
        const submissions = await Promise.all(
            sub.rows.map(async (s) => {
                const items =
                    await SubmissionItemRepository.findBySubmissionId(
                        s.id_submission
                    );
                return {
                    id_submission: s.id_submission,
                    id_exam: s.id_exam,
                    id_student: s.id_student,
                    submitted_at: s.submitted_at,
                    items: items.rows
                };
            })
        );
        return submissions;
    }
};

export { SubmissionService };