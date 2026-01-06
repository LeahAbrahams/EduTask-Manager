export interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher';
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  createdDate: string;
  teacherId: string;
  isOpen?: boolean;
}

export interface Submission {
  _id: string;
  assignmentId: Assignment | string;
  studentId: User | string;
  githubLink: string;
  partner?: User | string;
  grade?: number;
  feedback?: string;
  isGraded?: boolean;
}

export interface LoginRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: 'Student' | 'Teacher';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  dueDate: string;
}

export interface SubmitAssignmentRequest {
  assignmentId: string;
  githubLink: string;
  partner?: string;
}

export interface GradeSubmissionRequest {
  grade: number;
  feedback?: string;
}