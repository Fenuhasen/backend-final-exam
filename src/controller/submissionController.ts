import { Request, Response } from "express";
import { SubmissionService } from "../service/submissionService";
import { SubmissionDTO } from "../dto/submissionDto";

const SubmissionController = {
    async createSubmission(req: Request, res: Response) {
        try {
            const submission: SubmissionDTO = req.body;
            const sub = await SubmissionService.createSubmission(submission);
            res.status(201).json(sub);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la création de la submission"
            });
        }
    },
    async findAll(req: Request, res: Response){
        try {
            res.json({message: "Submissions listes"})
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