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