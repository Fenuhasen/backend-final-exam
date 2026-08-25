import { questionRepository } from "../repository/questionRepository";
import { QuestionWithChoice } from "../model/exam";
import { CreateQuestionInput } from "../dto/examDto";

export const questionService = {
    async listByExam(examId: number): Promise<QuestionWithChoice[]> {
        return questionRepository.findByExamWithChoices(examId);
    },

    async create(examId: number, input: CreateQuestionInput): Promise<QuestionWithChoice> {
        const position = await questionRepository.countByExam(examId);
        return questionRepository.createWithChoices(examId, input, position);
    },

    async delete(questionId: number): Promise<void> {
        await questionRepository.delete(questionId);
    },
};