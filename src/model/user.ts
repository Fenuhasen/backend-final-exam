export enum UserRole {
  ADMIN = "ADMIN",
  ETUDIANT = "ETUDIANT"
}

export enum UserStatus {
  ACTIF = "ACTIF",
  DESACTIVE = "DESACTIVE"
}

export interface User {
  id_user: number;
  first_name: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
}

export interface Student extends User {
  role: UserRole.ETUDIANT;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
}

export interface UpdateStudentDTO {
  firstName?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateAdminDTO {
  firstName: string;
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminDTO {
  firstName?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateStudentDTO {
  first_name?: string; 
  last_name: string;        
  email: string;
  password: string;
}

export interface UpdateStudentDTO {
  firstName?: string;
  name?: string;
  email?: string;
  password?: string;
}