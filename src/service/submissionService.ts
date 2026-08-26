import { Correction, CorrectionItem } from "../dto/CorrectionDto";
import { SubmissionDTO } from "../dto/submissionDto";
import { Question } from "../model/exam";
import { examRepository } from "../repository/examRepository";
import { questionRepository } from "../repository/questionRepository";
import SubmissionItemRepository from "../repository/submissionItemRepository";
import { SubmissionRepository } from "../repository/submissionRepository";

const SubmissionService = {
    createSubmission(submission: SubmissionDTO) {
        return SubmissionRepository.createSubmission(submission);
    },
    async findAll() {
        const sub = await SubmissionRepository.findAll();
        const submissions = await Promise.all(
            sub.rows.map(async (s) => {
                const items =
                    await SubmissionItemRepository.findBySubmissionId(
                        s.id_submission
                    );
                return {
                    id_submission: s.id_submission,
                    id_exam: s.id_exam,
                    id_student: s.id_student,
                    submitted_at: s.submitted_at,
                    items: items.rows
                };
            })
        );
        return submissions;
    },
    async findById(id: number): Promise<SubmissionDTO | null> {
        const sub = await SubmissionRepository.findById(id);

        if (sub.rows.length === 0) {
            return null;
        }

        const s = sub.rows[0];

        const items = await SubmissionItemRepository.findBySubmissionId(
            s.id_submission
        );

        return {
            id_exam: s.id_exam,
            id_student: s.id_student,
            answers: items.rows
        };
    },
    async findByExamId(idExam: number) {
        const sub = await SubmissionRepository.findByExamId(idExam);
        const submissions = await Promise.all(
            sub.rows.map(async (s) => {
                const items =
                    await SubmissionItemRepository.findBySubmissionId(
                        s.id_submission
                    );
                return {
                    id_submission: s.id_submission,
                    id_exam: s.id_exam,
                    id_student: s.id_student,
                    submitted_at: s.submitted_at,
                    items: items.rows
                };
            })
        );
        return submissions;
    },
    async findByStudentId(idStudent: number) {
        const sub = await SubmissionRepository.findByStudentID(idStudent);
        const submissions = await Promise.all(
            sub.rows.map(async (s) => {
                const items =
                    await SubmissionItemRepository.findBySubmissionId(
                        s.id_submission
                    );
                return {
                    id_submission: s.id_submission,
                    id_exam: s.id_exam,
                    id_student: s.id_student,
                    submitted_at: s.submitted_at,
                    items: items.rows
                };
            })
        );
        return submissions;
    },

    async createCorrectionItems(submission: SubmissionDTO): Promise<CorrectionItem[]> {
        const list: CorrectionItem[] = [];
        const answerList = [...submission.answers].sort((a, b) => a.question_id - b.question_id);
        const questions = await questionRepository.findByExamWithChoices(submission.id_exam);
        questions.sort((a, b) => a.questionId - b.questionId);
        for (const question of questions) {

            const studentAnswer = answerList.find(
                answer => answer.question_id === question.questionId
            );

            const correctAnswer = question.choice.find(
                choice => choice.isCorrect
            );

            if (!correctAnswer) {
                throw new Error(
                    `No correct answer found for question ${question.questionId}`
                );
            }

            list.push({
                question_id: question.questionId,
                statement: question.statement,
                points: question.points,
                student_choice_id: studentAnswer?.choice_id || null,
                correct_choice_id: correctAnswer.choiceId,
                is_correct:
                    studentAnswer?.choice_id === correctAnswer.choiceId
            });
        }

        return list;
    },
    async getResult(submission: SubmissionDTO): Promise<Correction> {
        return {
            id_exam: submission.id_exam,
            id_student: submission.id_student,
            answers: await this.createCorrectionItems(submission)
        };
    }
};

export { SubmissionService };