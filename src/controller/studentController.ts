import { Request, Response } from 'express';
import { StudentService } from '../service/studentService';

export class StudentController {

  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  async getAllStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await this.studentService.getAllStudents();

      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error
          ? error.message
          : 'Internal server error'
      });
    }
  }

  async getStudentById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          message: 'Invalid student ID'
        });
        return;
      }

      const student = await this.studentService.getStudentById(id);

      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({
          message: error.message
        });
        return;
      }

      res.status(500).json({
        message: error instanceof Error
          ? error.message
          : 'Internal server error'
      });
    }
  }

  async createStudent(req: Request, res: Response): Promise<void> {
    try {
      const student = await this.studentService.createStudent(req.body);

      res.status(201).json(student);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists') {
        res.status(409).json({
          message: error.message
        });
        return;
      }

      res.status(400).json({
        message: error instanceof Error
          ? error.message
          : 'Unable to create student'
      });
    }
  }

  async updateStudent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          message: 'Invalid student ID'
        });
        return;
      }

      const student = await this.studentService.updateStudent(
        id,
        req.body
      );

      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({
          message: error.message
        });
        return;
      }

      if (error instanceof Error && error.message === 'Email already exists') {
        res.status(409).json({
          message: error.message
        });
        return;
      }

      res.status(400).json({
        message: error instanceof Error
          ? error.message
          : 'Unable to update student'
      });
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          message: 'Invalid student ID'
        });
        return;
      }

      await this.studentService.deleteStudent(id);

      res.status(200).json({
        message: 'Student deactivated successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({
          message: error.message
        });
        return;
      }

      res.status(500).json({
        message: error instanceof Error
          ? error.message
          : 'Internal server error'
      });
    }
  }
}