import { questionRepository } from "../repository/questionRepository";
import { examRepository } from "../repository/examRepository";
import { CreateQuestionInput, ExamDto, Question } from "../dto/examDto";

export const questionService = {
    async listByExam(examId: number): Promise<Question[]> {
        return questionRepository.findByExamWithChoices(examId);
    },

    async create(examId: number, input: CreateQuestionInput): Promise<Question> {
        if (!(await examRepository.findById(examId))) {
            throw new Error("Exam not found");
        }
        if (!Array.isArray(input.choices) || input.choices.length < 2 || input.choices.length > 6) {
            throw new Error("Invalid choices");
        }
        if (input.choices.filter((choice) => choice.is_correct).length !== 1) {
            throw new Error("Invalid correct choice");
        }

        const position = await questionRepository.countByExam(examId);
        return questionRepository.createWithChoices(examId, input, position);
    },

    async delete(questionId: number): Promise<void> {
        await questionRepository.delete(questionId);
    },
};