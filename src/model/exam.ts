export interface Exam {
    examId: number;
    title: string;
    description: string;
    courseId: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
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

export type ExamWindowStatus = "upcoming" | "open" | "closed" | "done";