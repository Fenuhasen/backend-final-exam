import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/userRepository';
import {
  CreateStudentDTO,
  UpdateStudentDTO,
  UserRole
} from '../model/user';
import { StudentDTO } from '../dto/userDto';

export class UserService {

  private userRepository = UserRepository;

  constructor() {
  }

  async getAllStudents(): Promise<StudentDTO[]> {
    const result: StudentDTO[] = [];
    (await this.userRepository.findStudents()).forEach(student => {
      result.push(
        {
          id: student.id_user,
          name: `${student.first_name}  ${student.name}`,
          email: student.email,
          is_active: student.status == "ACTIF",
          created_at: student.created_at
        }
      )
    });
    return result;
  }

  async getStudentById(id: number): Promise<StudentDTO> {
    if (id <= 0) {
      throw new Error('Invalid student ID');
    }

    const student = await this.userRepository.findById(id);

    if (!student) {
      throw new Error('Student not found');
    }

    if (student.role === UserRole.ETUDIANT) {
      return {
        id: student.id_user,
        name: `${student.first_name}  ${student.name}`,
        email: student.email,
        is_active: student.status == "ACTIF",
        created_at: student.created_at
      };
    }

    if (student.role === UserRole.ADMIN) {
      throw new Error('User is an admin');
    }

    throw new Error('Invalid user role');
  }

  async createStudent(
    data: CreateStudentDTO,
    role: UserRole
  ): Promise<StudentDTO> {

    if (role !== UserRole.ADMIN) {
      throw new Error('Only admin can create students');
    }

    this.validateStudentData(data);

    const existingStudent =
      await this.userRepository.findByEmail(data.email);

    if (existingStudent) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.userRepository.createStudent({
      ...data,
      password: hashedPassword
    });
  }

  async updateStudent(
    id: number,
    data: UpdateStudentDTO,
    role: UserRole
  ): Promise<StudentDTO> {

    if (role !== UserRole.ADMIN) {
      throw new Error('Only admin can update students');
    }

    if (id <= 0) {
      throw new Error('Invalid student ID');
    }

    const student = await this.getStudentById(id);

    if (data.email && data.email !== student.email) {
      const existingStudent =
        await this.userRepository.findByEmail(data.email);

      if (existingStudent) {
        throw new Error('Email already exists');
      }
    }

    const dataToUpdate = data.password === undefined
      ? data
      : {
          ...data,
          password: await bcrypt.hash(data.password, 10)
        };

    const updated =
      await this.userRepository.updateStudent(id, dataToUpdate);

    if (!updated) {
      throw new Error('Student not found');
    }

    return updated;
  }

  async deleteStudent(
    id: number,
    role: UserRole
  ): Promise<StudentDTO> {

    if (role !== UserRole.ADMIN) {
      throw new Error('Only admin can deactivate students');
    }

    if (id <= 0) {
      throw new Error('Invalid student ID');
    }

    await this.getStudentById(id);

    const currentStudent = await this.userRepository.findById(id);

    if (!currentStudent) {
      throw new Error('Student not found');
    }

    const student = await this.userRepository.toggleStudentStatus(
      id,
      currentStudent.status
    );

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  private validateStudentData(data: CreateStudentDTO): void {

    if (!data.first_name?.trim()) {
      throw new Error('First name is required');
    }

    if (!data.last_name?.trim()) {
      throw new Error('Last name is required');
    }

    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }

    if (!data.password?.trim()) {
      throw new Error('Password is required');
    }

    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}