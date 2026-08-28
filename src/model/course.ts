export interface Course {
  id_course: number;
  code: string;
  name: string;
  description: string;
}

export interface CreateCourseInput {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateCourseInput {
  code?: string;
  name?: string;
  description?: string;
}
