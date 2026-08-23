export interface Exam {
    examId: number;
    title: string;
    description: string;
    courseId: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
}

export interface Question {
    questionId: number;
    examId: number;
    statement: string;
    points: number;
    position: number;
}

export interface Choice {
    choiceId: number;
    questionId: number;
    text: string;
    isCorrect: boolean;
}

export interface QuestionWithChoice extends Question {
    choices: Choice[];
}

export interface Submission {
    submissionId: number;
    examId: number;
    studentId: number;
    score: number;
    submittedAt: Date;
}

export interface SubmissionItem {
    submissionItemId: number;
    submissionId: number;
    questionId: number;
    choiceId: number | null;
}

export interface SubmissionWithItems extends Submission {
    items: SubmissionItem[];
}

export interface CreateExamInput {
    courseId: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

export interface UpdateExamInput {
    courseId?: number;
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
}

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

export type ExamWindowStatus = "upcoming" | "open" | "closed" | "done";