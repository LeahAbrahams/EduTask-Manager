import { Submission, ISubmission } from "../Submission/SubmissionModel";
import { Assignments } from "../Assignments/assignmentModel";
import { Types } from "mongoose";
import { promises } from "dns";
import { teacherRouter } from "../../Routers/Teacher/TeachrRouter";
import { logger } from "../../Utils/Logger";
import { studentRouter } from "../../Routers/Student/StudentRouter";
import { IUser, userSchema, User } from "../Users/UserModel";
import { UserService } from "../Users/UserService";

export class SubmissionService {
  //teacher
  async getSubmissions(teacherId: string): Promise<ISubmission[]> {
    // מוצא את כל המטלות של המורה
    const teacherAssignments = await Assignments.find({ teacherId: teacherId }).select('_id').lean().exec();
    const assignmentIds = teacherAssignments.map(a => (a as any)._id);
    
    if (assignmentIds.length === 0) {
      logger.info(`No assignments found for teacher ${teacherId}`);
      return [];
    }
    
    // מוצא את כל ההגשות למטלות של המורה
    const submissions = await Submission.find({ 
      assignmentId: { $in: assignmentIds } 
    })
      .populate("assignmentId")
      .populate("studentId", "userId name")
      .populate("partner")
      .lean()
      .exec() as ISubmission[];
      
    logger.info(`Fetched ${submissions.length} submissions for teacher ${teacherId}`);
    return submissions;
  }

  async giveFeedback(studentId: string, assignmentId: string, feedbackData: string, sub: any): Promise<ISubmission> {
    const updatedSubmission = (await Submission.findOneAndUpdate(
      {
        studentId: studentId,
        assignmentId: assignmentId,
      },
      { $set: { feedback: feedbackData, grade: sub?.grade } },
      { new: true }
    ).exec()) as ISubmission;
    
    // עדכון השותף אם קיים
    if (updatedSubmission.partner?.partnerId) {
      await Submission.findOneAndUpdate(
        {
          studentId: updatedSubmission.partner.partnerId,
          assignmentId: assignmentId,
        },
        { $set: { feedback: feedbackData, grade: sub?.grade } },
        { new: true }
      ).exec();
      
      logger.info(`Feedback also given to partner ${updatedSubmission.partner.partnerId}`);
    }
    
    logger.info(
      `Feedback given to student ${studentId} for assignment ${assignmentId}`
    );
    return updatedSubmission;
  }

  async getAverages(studentId: string): Promise<number> {
    const submissions = await Submission.find({
      studentId: studentId,
      grade: { $exists: true, $ne: null },
    }).exec();

    if (submissions.length == 0) {
      return 0;
    }

    let sum = submissions.reduce((count: number, sub: ISubmission) => {
      return count + (sub.grade || 0);
    }, 0);

    logger.info(`Calculated average for student ${studentId}`);
    return sum / submissions.length;
  }

  //student
  async createSubmission(
    studentId: Types.ObjectId,
    assignmentId: Types.ObjectId,
    githubLink: string,
    partnerId?: string
  ): Promise<ISubmission> {
    const newSubmission = new Submission({
      studentId,
      assignmentId,
      githubLink,
      partner: partnerId ? { partnerId: partnerId } : undefined,
    });
    await newSubmission.save();
    logger.info(
      `New submission created by student ${studentId} for assignment ${assignmentId}`
    );
    return newSubmission;
  }

  async mySubmissions(studentId: string): Promise<ISubmission[]> {
    // הגשות שהסטודנט יצר
    let submissions = await Submission.find({ studentId: studentId }).exec();
    
    // הגשות שהסטודנט הוא שותף בהן
    const partnerSubmissions = await Submission.find({
      "partner.partnerId": studentId,
    }).exec();
    
    submissions.push(...partnerSubmissions);
    logger.info(`Fetched ${submissions.length} submissions for student ${studentId}`);
    return submissions;
  }
}
