import { Router } from "express";
import SubmissionController from "../controller/submissionController";

const router = Router();

router.post("/", SubmissionController.createSubmission);
router.get("/", SubmissionController.findAll)
router.get("/examens/:id/", SubmissionController.findByExamId)

export default router;