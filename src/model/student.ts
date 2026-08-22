import { User, UserRole, UserStatus } from "./src/model/user";


export interface Student extends User {
    role: UserRole.ETUDIANT;
}

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateStudentDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}