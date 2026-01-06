import { Assignments, IAssignments } from "./assignmentModel";
import { logger } from "../../Utils/Logger";

export class AssignmentsService {
//teachr
    async createAssignment(teacherId : string, assignmentData : any) : Promise<IAssignments> {
        // מיצר מ.ז. של המטלה ומחזיר אותו יחד עם הנתונים האחרים
        if (!assignmentData.title || !assignmentData.description || !assignmentData.dueDate) {
            throw new Error("Missing required fields");
        }

        const newAssignment = new Assignments({
            title: assignmentData.title,
            description: assignmentData.description,
            dueDate: assignmentData.dueDate,
            teacherId
        });
        const saved = await newAssignment.save();
        logger.info(`Created assignment ${saved._id} by teacher ${teacherId}`);
        return saved;
    }    

//student
    async getOpenAssignments(): Promise<IAssignments[]> {
        const currentDate = new Date();
        const openAssignments = await Assignments.find({
            dueDate: { $gt: currentDate }
        }).lean().exec() as IAssignments[];
        logger.info(`Found ${openAssignments.length} open assignments`);
        return openAssignments;
    }
}