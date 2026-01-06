import apiClient from './api';
import { Assignment, CreateAssignmentRequest } from '../types';

export const assignmentService = {
  async getAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get('/assignments');
    return response.data;
  },

  async createAssignment(assignment: CreateAssignmentRequest): Promise<Assignment> {
    console.log('📋 Creating new assignment:', assignment.title);
    const response = await apiClient.post('/assignments', assignment);
    console.log('✅ Assignment created successfully');
    return response.data;
  },

  async getAssignmentById(id: string): Promise<Assignment> {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  async getOpenAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get('/assignments/open');
    return response.data;
  },

  async getAssignmentAverages(): Promise<any> {
    const response = await apiClient.get('/teacher/averages');
    return response.data;
  }
};