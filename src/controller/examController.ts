import { Request, Response } from "express";
import { examService } from "../service/examService";
import { questionService } from "../service/questionService";

export const examController = {
    async list(req: Request, res: Response) {
        res.json(await examService.listAll());
    },

    async getById(req: Request, res: Response) {
        res.json(await examService.getByIdForAdmin(Number(req.params.id)));
    },

    async create(req: Request, res: Response) {
        res.status(201).json(await examService.create(req.body));
    },

    async update(req: Request, res: Response) {
        res.json(await examService.update(Number(req.params.id), req.body));
    },

    async remove(req: Request, res: Response) {
        await examService.delete(Number(req.params.id));
        res.status(204).end();
    },

    async listQuestions(req: Request, res: Response) {
        res.json(await questionService.listByExam(Number(req.params.id)));
    },

    async createQuestion(req: Request, res: Response) {
        res.status(201).json(await questionService.create(Number(req.params.id), req.body));
    },

    async removeQuestion(req: Request, res: Response) {
        await questionService.delete(Number(req.params.id));
        res.status(204).end();
    },
};