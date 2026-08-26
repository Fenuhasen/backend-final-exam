import { Router } from "express";
import { examController } from "../controller/examController";
// Student
import { studentExamController } from "../controller/studentExamController";
import SubmissionController from "../controller/submissionController";

const router = Router();

// admin
router.get("/", examController.list);
router.get("/:id", examController.getById);
router.get("/:id/results", examController.getAllResults);
router.get("/:id/questions", examController.listQuestions);


router.post("/", examController.create);
router.put("/:id", examController.update);
router.delete("/:id", examController.remove);
router.delete("/:id", examController.remove);
router.get("/:id/submissions", SubmissionController.findByExamId);

router.post("/:id/questions", examController.createQuestion);

// admin
router.delete("/:id", examController.removeQuestion);

export default router;