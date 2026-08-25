import { Router } from 'express';
import { UserController } from '../controller/userController';

const router = Router();

const userController = new UserController();

router.get('/', (req, res) =>
  userController.getAllStudents(req, res)
);

router.get('/:id', (req, res) =>
  userController.getStudentById(req, res)
);

router.post('/students', (req, res) =>
  userController.createStudent(req, res)
);

router.put('/:id', (req, res) =>
  userController.updateStudent(req, res)
);

router.delete('/:id', (req, res) =>
  userController.deleteStudent(req, res)
);

export default router;