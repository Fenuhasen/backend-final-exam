import { Router } from "express";
// Student
import { studentExamController } from "../controller/studentExamController";
import SubmissionController from "../controller/submissionController";
import { authenticate, requireRole } from "../middleware/authMiddleware";

const router = Router();

// Student
router.use(authenticate, requireRole("ETUDIANT", "student"));
router.get("/exams", studentExamController.listAvailable);
router.get("/exams/:id", studentExamController.getToTake);
router.post("/exams/:id/submit", studentExamController.submit);
router.get("/results", studentExamController.results);

export default router;