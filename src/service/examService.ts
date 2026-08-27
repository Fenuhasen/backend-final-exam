import { examRepository } from "../repository/examRepository";
import { questionRepository } from "../repository/questionRepository";
import { Exam, ExamWindowStatus } from "../model/exam";
import { CreateExamInput, ExamDto, UpdateExamInput } from "../dto/examDto";
import { Result, Result_item } from "../dto/resultsDto";
import pool from "../config/db";
import { SubmissionRepository } from "../repository/submissionRepository";

function computeWindowStatus(exam: ExamDto): ExamWindowStatus {
    const now = new Date();
    if (now < exam.starts_at) return "upcoming";
    if (now >= exam.ends_at) return "closed";
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
                    [exam.id]
                )
                .then((r) => Number(r.rows[0].count));

            const attemptCount = await pool
                .query(
                    "SELECT COUNT(*) FROM submissions WHERE id_exam = $1",
                    [exam.id]
                )
                .then((r) => Number(r.rows[0].count));

            const course = await pool.query(
                "SELECT id_course, code, name FROM courses WHERE id_course = $1",
                [exam.course.id]
            );

            result.push({
                id: exam.id,
                title: exam.title,
                description: exam.description,
                starts_at: exam.starts_at,
                ends_at: exam.ends_at,

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
    async getByIdForAdmin(id: number) {
        const exam = await examRepository.findById(id);
        if (!exam) {
            throw new Error("Exam not found");
        }
        const questions = await questionRepository.findByExamWithChoices(id);
        return { ...exam, questions };
    },

    async create(input: CreateExamInput): Promise<ExamDto> {
        await this.validateExamInput(input);
        return examRepository.create(input);
    },

    async update(id: number, input: UpdateExamInput): Promise<ExamDto | null> {
        const existingExam = await examRepository.findById(id);
        if (!existingExam) {
            throw new Error("Exam not found");
        }
        await this.validateExamInput({
            ...input,
            starts_at: input.starts_at ?? existingExam.starts_at.toISOString(),
            ends_at: input.ends_at ?? existingExam.ends_at.toISOString()
        });
        return examRepository.update(id, input);
    },

    async delete(id: number): Promise<void> {
        await examRepository.delete(id);
    },

    async listWithWindowStatus(studentId?: number) {
        const exams = await examRepository.findAll();
        const available = [];
        for (const exam of exams) {
            if (computeWindowStatus(exam) !== "open") continue;
            if (studentId !== undefined && (await SubmissionRepository.findByStudentAndExam(studentId, exam.id)).rows.length > 0) continue;
            const questions = await questionRepository.findByExam(exam.id);
            const course = await pool.query("SELECT code, name FROM courses WHERE id_course = $1", [exam.course.id]);
            available.push({
                id: exam.id,
                title: exam.title,
                course: { code: course.rows[0].code, name: course.rows[0].name },
                description: exam.description,
                ends_at: exam.ends_at,
                question_count: questions.length,
                total_points: questions.reduce((sum, question) => sum + question.points, 0)
            });
        }
        return available;
    },

    async getForStudentToTake(id: number) {
        const exam = await examRepository.findById(id);
        const questions = await questionRepository.findByExamWithChoices(id);

        return {
            id: exam?.id,
            title: exam?.title,
            course: {
                code: exam?.course.code,
                name: exam?.course.name
            },
            description: exam?.description,
            ends_at: exam?.ends_at,
            question_count: exam?.question_count,
            total_points: questions.reduce((total, q) => total + q.points, 0),
            questions: questions.map((q) => ({
                id: q.id,
                statement: q.statement,
                points: q.points,
                position: q.position,
                choices: q.choices.map((c) => ({ id: c.id, text: c.text })),
            })),
        };
    },
    async getAllResults(id: number): Promise<Result>{
        return this.getExamStatistics(id);
    },

    async validateExamInput(input: Partial<CreateExamInput>): Promise<void> {
        if (input.course_id !== undefined && !(await pool.query(
            "SELECT id_course FROM courses WHERE id_course = $1",
            [input.course_id]
        )).rows[0]) {
            throw new Error("Course not found");
        }

        if (input.starts_at !== undefined && input.ends_at !== undefined) {
            const startsAt = new Date(input.starts_at);
            const endsAt = new Date(input.ends_at);
            if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || startsAt >= endsAt) {
            throw new Error("End date must be after start date");
            }
        }
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
            id: exam.id,
            title: exam.title
        },
        total_points,
        average,
        attempt_count,
        results
    };
}
};
