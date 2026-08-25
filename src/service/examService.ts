import { examRepository } from "../repository/examRepository";
import { questionRepository } from "../repository/questionRepository";
import { Exam, ExamWindowStatus } from "../model/exam";
import { CreateExamInput, UpdateExamInput } from "../dto/examDto";

function computeWindowStatus(exam: Exam): ExamWindowStatus {
    const now = new Date();
    if (now < exam.startDate) return "upcoming";
    if (now >= exam.endDate) return "closed";
    return "open";
}

export const examService = {

    async listAll(): Promise<Exam[]> {
        return examRepository.findAll();
    },

    async getByIdForAdmin(examId: number) {
        const exam = await examRepository.findById(examId);
        const questions = await questionRepository.findByExamWithChoices(examId);
        return { ...exam, questions };
    },

    async create(input: CreateExamInput): Promise<Exam> {
        return examRepository.create(input);
    },

    async update(examId: number, input: UpdateExamInput): Promise<Exam | null> {
        return examRepository.update(examId, input);
    },

    async delete(examId: number): Promise<void> {
        await examRepository.delete(examId);
    },

    async listWithWindowStatus(): Promise<Array<Exam & { status: ExamWindowStatus }>> {
        const exams = await examRepository.findAll();
        return exams.map((exam) => ({ ...exam, status: computeWindowStatus(exam) }));
    },

    async getForStudentToTake(examId: number) {
        const exam = await examRepository.findById(examId);
        const questions = await questionRepository.findByExamWithChoices(examId);

        return {
            examId: exam?.examId,
            title: exam?.title,
            description: exam?.description,
            startDate: exam?.startDate,
            endDate: exam?.endDate,
            questions: questions.map((q) => ({
                questionId: q.questionId,
                statement: q.statement,
                points: q.points,
                choice: q.choice.map((c) => ({ choiceId: c.choiceId, text: c.text })),
            })),
        };
    },
};
