import apiClient from './api';
import { Submission, SubmitAssignmentRequest, GradeSubmissionRequest } from '../types';

export const submissionService = {
  async submitAssignment(submission: SubmitAssignmentRequest): Promise<Submission> {
    console.log('📤 Submitting assignment:', submission.assignmentId);
    const response = await apiClient.post('/student/submit', submission);
    console.log('✅ Assignment submitted successfully');
    return response.data;
  },

  async getMySubmissions(): Promise<Submission[]> {
    const response = await apiClient.get('/student/submissions');
    return response.data;
  },

  async getAllSubmissions(): Promise<Submission[]> {
    const response = await apiClient.get('/teacher/submissions');
    return response.data;
  },

  async gradeSubmission(submissionId: string, gradeData: GradeSubmissionRequest): Promise<Submission> {
    console.log('📊 Grading submission:', submissionId);
    const response = await apiClient.put(`/teacher/grade/${submissionId}`, gradeData);
    console.log('✅ Submission graded successfully');
    return response.data;
  },

  async getStudents(): Promise<any[]> {
    const response = await apiClient.get('/teacher/students');
    return response.data;
  }
};