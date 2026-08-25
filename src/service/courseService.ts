import {
  CreateCourseInput,
  UpdateCourseInput,
} from '../model/course';
import { CourseRepository } from '../repository/courseRepository';

export const CourseService = {
  async list() {
    return CourseRepository.findAll();
  },

  async getById(id: number) {
    return CourseRepository.findById(id);
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
