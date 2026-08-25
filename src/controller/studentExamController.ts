import { Request, Response } from "express";
import { examService } from "../service/examService";

export const studentExamController = {
    async listAvailable(req: Request, res: Response) {
        res.json(await examService.listWithWindowStatus());
    },

    async getToTake(req: Request, res: Response) {
        res.json(await examService.getForStudentToTake(Number(req.params.id)));
    },
};