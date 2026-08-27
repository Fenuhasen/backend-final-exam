import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import { UserRole } from '../model/user';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class UserController {

  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllStudents(
    req: Request,
    res: Response
  ): Promise<void> {

    try {
      const students = await this.userService.getAllStudents();

      res.status(200).json(students);

    } catch (error) {

      res.status(500).json({
        message: error instanceof Error
          ? error.message
          : 'Internal server error'
      });
    }
  }

  async getStudentById(
    req: Request,
    res: Response
  ): Promise<void> {

    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          message: 'Invalid student ID'
        });
        return;
      }

      const student =
        await this.userService.getStudentById(id);

      res.status(200).json(student);

    } catch (error) {

      if (
        error instanceof Error &&
        error.message === 'Student not found'
      ) {
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

  async createStudent(
    req: Request,
    res: Response
  ): Promise<void> {

    try {

      const { role: _ignoredRole, ...studentData } = req.body;
      const role = (req as AuthenticatedRequest).user?.role as UserRole;

      const student =
        await this.userService.createStudent(
          studentData,
          role
        );

      res.status(201).json(student);

    } catch (error) {

      if (
        error instanceof Error &&
        error.message === 'Only admin can create students'
      ) {
        res.status(403).json({
          message: error.message
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === 'Email already exists'
      ) {
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

  async updateStudent(
    req: Request,
    res: Response
  ): Promise<void> {

    try {

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          message: 'Invalid student ID'
        });
        return;
      }

      const { role: _ignoredRole, ...studentData } = req.body;
      const role = (req as AuthenticatedRequest).user?.role as UserRole;

      const student =
        await this.userService.updateStudent(
          id,
          studentData,
          role
        );

      res.status(200).json(student);

    } catch (error) {

      if (
        error instanceof Error &&
        error.message === 'Only admin can update students'
      ) {
        res.status(403).json({
          message: error.message
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === 'Student not found'
      ) {
        res.status(404).json({
          message: error.message
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === 'Email already exists'
      ) {
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

  async deleteStudent(
    req: Request,
    res: Response
  ): Promise<void> {

    try {

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          message: 'Invalid student ID'
        });
        return;
      }

      const role = (req as AuthenticatedRequest).user?.role as UserRole;

      await this.userService.deleteStudent(id, role);

      res.status(200).json({
        message: 'Student deactivated successfully'
      });

    } catch (error) {

      if (
        error instanceof Error &&
        (
          error.message === 'Only admin can deactivate students'
        )
      ) {
        res.status(403).json({
          message: error.message
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === 'Student not found'
      ) {
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