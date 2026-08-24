import { Request, Response } from "express";
import { SubmissionService } from "../service/submissionService";
import { SubmissionDTO } from "../dto/submissionDto";

const SubmissionController = {
    async createSubmission(req: Request, res: Response) {
        try {
            const submission: SubmissionDTO = req.body;
            const sub = await SubmissionService.createSubmission(submission);
            res.status(201).json({ message: "Submission créée avec succès", submission: sub.rows[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la création de la submission"
            });
        }
    },
    async findAll(req: Request, res: Response){
        try {
            const sub = (await SubmissionService.findAll());
            res.status(200).json(sub);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la création de la submission",
                error: error
            });
        }
    },
    async findByExamId(req: Request, res: Response){
        try {
            const { id } = req.params
            const sub = (await SubmissionService.findByExamId( Number(id) ));
            res.status(200).json(sub);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la création de la submission",
                error: error
            });
        }
    }
};  

export default SubmissionController;