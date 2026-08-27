import { examRepository } from "../repository/examRepository";
import { questionRepository } from "../repository/questionRepository";
import { Exam, ExamWindowStatus } from "../model/exam";
import { CreateExamInput, ExamDto, UpdateExamInput } from "../dto/examDto";
import { Result, Result_item } from "../dto/resultsDto";
import pool from "../config/db";
import { SubmissionRepository } from "../repository/submissionRepository";

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

    async listWithWindowStatus(studentId?: number) {
        const exams = await examRepository.findAll();
        const available = [];
        for (const exam of exams) {
            if (computeWindowStatus(exam) !== "open") continue;
            if (studentId !== undefined && (await SubmissionRepository.findByStudentAndExam(studentId, exam.examId)).rows.length > 0) continue;
            const questions = await questionRepository.findByExam(exam.examId);
            const course = await pool.query("SELECT code, name FROM courses WHERE id_course = $1", [exam.courseId]);
            available.push({
                id: exam.examId,
                title: exam.title,
                course: { code: course.rows[0].code, name: course.rows[0].name },
                description: exam.description,
                ends_at: exam.endDate,
                question_count: questions.length,
                total_points: questions.reduce((sum, question) => sum + question.points, 0)
            });
        }
        return available;
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
    async getAllResults(id: number): Promise<Result>{
        return this.getExamStatistics(id);
    },

    async getStudentResults(studentId: number) {
        const result = await examRepository.findStudentResults(studentId);
        return result.rows.map((row) => ({
            exam_id: row.id_exam,
            title: row.title,
            course_code: row.course_code,
            score: Number(row.score ?? 0),
            total_points: Number(row.total_points ?? 0),
            submitted_at: row.submitted_at
        }));
    },
    async getExamStatistics(id_exam: number): Promise<Result> {
    const exam = await examRepository.findById(id_exam);

    if (!exam) {
        throw new Error(`Exam ${id_exam} not found`);
    }

    const questions = await questionRepository.findByExam(id_exam);
    const total_points = questions.reduce((sum, q) => sum + q.points, 0);

    const submissions = await SubmissionRepository.findByExamWithStudents(id_exam);

    const attempt_count = submissions.rows.length;
    const average = attempt_count > 0
        ? submissions.rows.reduce((sum, submission) => sum + Number(submission.score ?? 0), 0) / attempt_count
        : 0;

    const results: Result_item[] = submissions.rows.map((submission) => ({
        student_id: submission.id_student,
        name: `${submission.first_name ?? ""} ${submission.last_name ?? ""}`.trim(),
        score: Number(submission.score ?? 0),
        submitted_at: submission.submitted_at
    }));

    return {
        exam: {
            id: exam.examId,
            title: exam.title
        },
        total_points,
        average,
        attempt_count,
        results
    };
}
};
