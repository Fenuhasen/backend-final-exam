import { SubmissionDTO } from "../dto/submissionDto";
import { SubmissionRepository } from "../repository/submissionRepository";

const SubmissionService = {
    createSubmission(submission: SubmissionDTO) {
        return SubmissionRepository.createSubmission(submission);
    }
};

export { SubmissionService };