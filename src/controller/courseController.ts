import { Router, Request, Response } from 'express';
import { CourseService } from '../service/courseService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const courses = await CourseService.list();
  res.json(courses);
});

router.post('/', async (req: Request, res: Response) => {
  const course = await CourseService.create(req.body);
  res.status(201).json(course);
});

router.put('/:id', async (req: Request, res: Response) => {
  const course = await CourseService.update(
    Number(req.params.id),
    req.body
  );

  res.json(course);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await CourseService.delete(Number(req.params.id));
  res.status(204).send();
});

export default router;
