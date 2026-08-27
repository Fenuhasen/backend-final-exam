import { Router } from "express";
import SubmissionController from "../controller/submissionController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", SubmissionController.findAll)
router.get("/:id", SubmissionController.findById)
router.get("/examens/:id/", SubmissionController.findByExamId)
router.get("/:id/correction", SubmissionController.getCorrectionBySubmission)
router.get("/students/:id/", SubmissionController.findByStudentId)

export default router;