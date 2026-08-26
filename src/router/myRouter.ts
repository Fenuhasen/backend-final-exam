import { Router } from "express";
// Student
import { studentExamController } from "../controller/studentExamController";
import SubmissionController from "../controller/submissionController";

const router = Router();

// Student
router.get("/exams", studentExamController.listAvailable);
router.get("/exams/:id", studentExamController.getToTake);
router.post("/exams/:id", SubmissionController.createSubmission);
router.get("/results", SubmissionController.findByStudentId)

export default router;