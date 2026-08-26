import { Request, Response } from "express";
import { SubmissionService } from "../service/submissionService";
import { SubmissionDTO } from "../dto/submissionDto";
import { Correction } from "../dto/CorrectionDto";

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
    async findAll(req: Request, res: Response) {
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
    async findByExamId(req: Request, res: Response) {
        try {
            const { id } = req.params
            const sub = (await SubmissionService.findByExamId(Number(id)));
            res.status(200).json(sub);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la création de la submission",
                error: error
            });
        }
    },
    async findByStudentId(req: Request, res: Response) {
        try {
            const { id } = req.params
            const sub = (await SubmissionService.findByStudentId(Number(id)));
            res.status(200).json(sub);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la création de la submission",
                error: error
            });
        }
    },

    async getCorrectionBySubmission(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const submission = await SubmissionService.findById(Number(id));

            if (!submission) {
                return res.status(404).json({
                    message: "Submission not found"
                });
            }

            const correction = await SubmissionService.getResult(submission);

            return res.status(200).json(correction);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },
    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const submission = await SubmissionService.findById(Number(id));

            if (!submission) {
                return res.status(404).json({
                    message: "Submission not found"
                });
            }

            return res.status(200).json(submission);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
};

export default SubmissionController;