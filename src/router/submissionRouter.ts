import { Router } from "express";
import SubmissionController from "../controller/submissionController";

const router = Router();

router.post("/", SubmissionController.createSubmission);
router.get("/", SubmissionController.findAll)

export default router;