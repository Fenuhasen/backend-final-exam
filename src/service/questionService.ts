import { questionRepository } from "../repository/questionRepository";
import { CreateQuestionInput, ExamDto, Question } from "../dto/examDto";

export const questionService = {
    async listByExam(examId: number): Promise<Question[]> {
        return questionRepository.findByExamWithChoices(examId);
    },

    async create(examId: number, input: CreateQuestionInput): Promise<Question> {
        const position = await questionRepository.countByExam(examId);
        return questionRepository.createWithChoices(examId, input, position);
    },

    async delete(questionId: number): Promise<void> {
        await questionRepository.delete(questionId);
    },
};