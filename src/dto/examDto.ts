export interface CreateExamInput {
    courseId: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
}

export type UpdateExamInput = Partial<CreateExamInput>;

export interface CreateChoiceInput {
    text: string;
    isCorrect: boolean;
}

export interface CreateQuestionInput {
    statement: string;
    points: number;
    choices: CreateChoiceInput[];
}

export interface SubmitAnswerInput {
    questionId: number;
    choiceId: number | null;
}

export interface SubmitExamInput {
    answers: SubmitAnswerInput[];
}

export interface ExamDto {
    id: number,
    title: string,
    description: string,
    starts_at: Date,
    ends_at: Date,
    course: {
        id: number,
        code: string,
        name: string
    },
    question_count: number,
    attempt_count: number
}