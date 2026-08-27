import { Request, Response } from "express";
import { examService } from "../service/examService";
import { SubmissionService } from "../service/submissionService";

function getUserId(req: Request): number {
    return Number((req as Request & { user?: { userId?: number } }).user?.userId);
}

export const studentExamController = {
    async listAvailable(req: Request, res: Response) {
        res.json(await examService.listWithWindowStatus(getUserId(req)));
    },

    async getToTake(req: Request, res: Response) {
        res.json(await examService.getForStudentToTake(Number(req.params.id)));
    },

    async submit(req: Request, res: Response) {
        const result = await SubmissionService.submitExam(
            Number(req.params.id),
            getUserId(req),
            req.body.answers
        );
        res.status(201).json(result);
    },

    async results(req: Request, res: Response) {
        res.json(await examService.getStudentResults(getUserId(req)));
    }
};