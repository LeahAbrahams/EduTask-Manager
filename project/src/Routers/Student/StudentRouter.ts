import { UserService } from "../../DB_Service/Users/UserService";
import { SubmissionService } from "../../DB_Service/Submission/SubmissionService";
import { IUser } from "../../DB_Service/Users/UserModel";
import { Router, Request, Response } from "express";
import { Types } from 'mongoose';
import { roleMiddleware } from "../../Middlware/AuthorizationMid";
import { AssignmentsService } from "../../DB_Service/Assignments/AssignmentsService";
import { authMiddleware } from "../../Middlware/AuthenticationMid";

const assignmentsService = new AssignmentsService();
const submissionService = new SubmissionService();

export const studentRouter = Router();

studentRouter.get('/assignments', authMiddleware, roleMiddleware('Student'), async (req: Request, res: Response) => {
    try {
        const openAssignments = await assignmentsService.getOpenAssignments();
        return res.status(200).json(openAssignments);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }                   
});

studentRouter.post('/submissions', authMiddleware, roleMiddleware('Student'), async (req: Request, res: Response) => {
    const { assignmentId, githubLink, partnerId } = req.body;
    const studentId = (req as any).user.userId; 
    try {
        // partnerId הוא אופציונלי, לא לשלוח אותו אם אין שותף
        const newSubmission = await submissionService.createSubmission(studentId, assignmentId, githubLink, partnerId || undefined);
        return res.status(200).json(newSubmission); 
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }       
});

studentRouter.get('/submissions/me', authMiddleware, roleMiddleware('Student'), async (req: Request, res: Response) => {
    const studentId = (req as any).user.userId;
    try {
        const submissions = await submissionService.mySubmissions(studentId);
        return res.status(200).json(submissions);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }       
});