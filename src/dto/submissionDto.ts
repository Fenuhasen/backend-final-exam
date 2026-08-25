import { SubmissionItemDto } from "./submissionItemDto";

export interface SubmissionDTO {
    id_exam: number;
    id_student: number;
    items: SubmissionItemDto[];
}