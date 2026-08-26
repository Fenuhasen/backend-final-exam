import { examRepository } from "../repository/examRepository";
import { questionRepository } from "../repository/questionRepository";
import { Exam, ExamWindowStatus } from "../model/exam";
import { CreateExamInput, ExamDto, UpdateExamInput } from "../dto/examDto";
import pool from "../config/db";
import { Result } from "pg";

function computeWindowStatus(exam: Exam): ExamWindowStatus {
    const now = new Date();
    if (now < exam.startDate) return "upcoming";
    if (now >= exam.endDate) return "closed";
    return "open";
}

export const examService = {

    async listAll(): Promise<ExamDto[]> {
        const exams = await examRepository.findAll();

        const result: ExamDto[] = [];

        for (const exam of exams) {
            const questionCount = await pool
                .query(
                    "SELECT COUNT(*) FROM questions WHERE id_exam = $1",
                    [exam.examId]
                )
                .then((r) => Number(r.rows[0].count));

            const attemptCount = await pool
                .query(
                    "SELECT COUNT(*) FROM submissions WHERE id_exam = $1",
                    [exam.examId]
                )
                .then((r) => Number(r.rows[0].count));

            const course = await pool.query(
                "SELECT id_course, code, name FROM courses WHERE id_course = $1",
                [exam.courseId]
            );

            result.push({
                id: exam.examId,
                title: exam.title,
                description: exam.description,
                starts_at: exam.startDate,
                ends_at: exam.endDate,

                course: {
                    id: course.rows[0].id_course,
                    code: course.rows[0].code,
                    name: course.rows[0].name
                },

                question_count: questionCount,
                attempt_count: attemptCount
            });
        }

        return result;
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
    async getAllResults(id: number): Promise<any>{
        return examRepository.findAll;
    }
};
