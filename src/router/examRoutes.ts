import { Router } from "express";
import { examController } from "../controller/examController";
// Student
import { studentExamController } from "../controller/studentExamController";
import SubmissionController from "../controller/submissionController";

const router = Router();

// admin
router.get("/", examController.list);
router.post("/", examController.create);
router.get("/:id", examController.getById);
router.put("/:id", examController.update);
router.delete("/:id", examController.remove);
router.get("/:id/submissions", SubmissionController.findByExamId);

router.get("/:id/questions", examController.listQuestions);
router.post("/:id/questions", examController.createQuestion);

// admin
router.delete("/:id", examController.removeQuestion);

// Student
router.get("/exams", studentExamController.listAvailable);
router.get("/exams/:id", studentExamController.getToTake);

export default router;