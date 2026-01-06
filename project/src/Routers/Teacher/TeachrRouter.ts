import { UserService } from "../../DB_Service/Users/UserService";
import { IUser } from "../../DB_Service/Users/UserModel";
import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { roleMiddleware } from "../../Middlware/AuthorizationMid";
import { SubmissionService } from "../../DB_Service/Submission/SubmissionService";
import { AssignmentsService } from "../../DB_Service/Assignments/AssignmentsService";
import { authMiddleware } from "../../Middlware/AuthenticationMid";

export const teacherRouter = Router();

const submissionService = new SubmissionService();
const assignmentsService = new AssignmentsService();

teacherRouter.post(
  "/assignments",
  authMiddleware,
  roleMiddleware("Teacher"),
  async (req: Request, res: Response) => {

    const teacherId = (req as any).user.userId;
    const assignmentData = req.body.data;
    try {
      const newAddignment = await assignmentsService.createAssignment(
        teacherId,
        assignmentData
      );
      return res.status(200).json(newAddignment); 
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
);

teacherRouter.get(
"/submissions", authMiddleware,roleMiddleware("Teacher"),
  async (req: Request, res: Response) => {
   
    // בפונקציה של מתן משוב לתלמיד מקבלים את מספר הזהות של התלמיד ומסתכלים על הגשה ספציפית ותלמיד בודד
    // לכן, כאן, מתבקש שמקבלים את של המורה ומסתכלים על כלל התלמידים בכלל ההגשות

    const teacherId = (req as any).user.userId;
    try {
      const submissions = await submissionService.getSubmissions(teacherId);
      return res.status(200).json(submissions);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
);


teacherRouter.put(
  "/submissions/:studentId/assignmentsId",
  authMiddleware,
  roleMiddleware("Teacher"),
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const assignmentId = req.query.assignmentId as string;
    const { feedback, submission } = req.body;
    
    if (!assignmentId) {
      return res.status(400).json({ message: "assignmentId query parameter required" });
    }
    try {
      const updatedSubmission = await submissionService.giveFeedback(
        studentId,
        assignmentId,
        feedback,
        submission
      );
      
      if (!updatedSubmission) {
        return res.status(404).json({ 
          message: "Submission not found",
          debug: { studentId, assignmentId }
        });
      }
      
      return res.status(200).json(updatedSubmission);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
);

teacherRouter.get(  "/stats/averages",authMiddleware, roleMiddleware("Teacher"),
 async (req: Request, res: Response) => {

  // מכיוון שבהמשך מצוין אתגר של החזרת ממוצע כיתתי הבנו שהממוצע כאן מתייחס לכל תלמיד בנפרד בכל המקצועות
    const studentId = req.query.studentId as string;
    try {
      const averages = await submissionService.getAverages(studentId);
      return res.status(200).json(averages);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
);
