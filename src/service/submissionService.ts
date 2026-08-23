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
                    id: s.id_submission,
                    idExam: s.id_exam,
                    idStudent: s.id_student,
                    submittedAt: s.submitted_at,
                    listItem: items.rows
                };
            })
        );
        return submissions;
    }
};

export { SubmissionService };