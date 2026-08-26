export interface SubmissionDTO {
    id_exam: number;
    id_student: number;
    answers: SubmissionItemDto[];
}

export interface SubmissionItemDto {
    question_id: number;
    choice_id: number;
}