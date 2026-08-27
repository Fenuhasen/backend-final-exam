import { Router } from 'express';
import { UserController } from '../controller/userController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

const userController = new UserController();

router.use(authenticate, requireRole("ADMIN", "admin"));

router.get('/', (req, res) =>
  userController.getAllStudents(req, res)
);

router.get('/:id', (req, res) =>
  userController.getStudentById(req, res)
);

router.post('/', (req, res) =>
  userController.createStudent(req, res)
);

router.put('/:id', (req, res) =>
  userController.updateStudent(req, res)
);

router.delete('/:id', (req, res) =>
  userController.deleteStudent(req, res)
);

export default router;