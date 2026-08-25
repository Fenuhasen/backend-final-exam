import pool from '../config/db';

import { CourseDto } from '../dto/courseDto';

import {
  CreateCourseInput,
  UpdateCourseInput,
} from '../model/course';

import { CourseRepository } from '../repository/courseRepository';

export const CourseService = {

  async list() {
    const result: CourseDto[] = [];
    const courses = await CourseRepository.findAll();

    for (const course of courses) {
      const examCount = await pool
        .query(
          "SELECT COUNT(*) FROM exams WHERE id_course = $1",
          [course.id_course]
        )
        .then((r) => Number(r.rows[0].count));

      result.push({
        id: course.id_course,
        code: course.code,
        name: course.name,
        description: course.description,
        exam_count: examCount
      });
    }

    return result;
  },

  async getById(id: number) {
    const course = await CourseRepository.findById(id);

    if (!course) {
      return null;
    }

    const examCount = await pool
      .query(
        "SELECT COUNT(*) FROM exams WHERE id_course = $1",
        [course.id_course]
      )
      .then((r) => Number(r.rows[0].count));

    const result: CourseDto = {
      id: course.id_course,
      code: course.code,
      name: course.name,
      description: course.description,
      exam_count: examCount
    };

    return result;
  },

  async create(data: CreateCourseInput) {
    return CourseRepository.create(data);
  },

  async update(id: number, data: UpdateCourseInput) {
    return CourseRepository.update(id, data);
  },

  async delete(id: number) {
    return CourseRepository.delete(id);
  },

};