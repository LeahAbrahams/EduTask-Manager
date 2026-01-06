import mongoose, {DataSizeOperatorReturningNumber, Schema, Types} from 'mongoose';
import { SubmissionService } from '../../DB_Service/Submission/SubmissionService';

export interface ISubmission extends Document {
    assignmentId: string;
    studentId: string;
    githubLink: string;
    partner?: { partnerId: string };
    grade?: number;
    feedback?: string;
}

export const submissionSchema = new Schema ({
    assignmentId: {type: Schema.Types.String, required: true},
    studentId: {type: Schema.Types.String, required: true},
    githubLink: {type: Schema.Types.String, required: true},
    partner: { type: new Schema({ partnerId: { type: Schema.Types.String } }, { _id: false }), required: false }, // אופציונלי
    grade: {type: Schema.Types.Number, required: false}, // אופציונלי
    feedback: {type: Schema.Types.String, required: false}, // אופציונלי
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

submissionSchema.virtual('isGraded').get(function(this: ISubmission) {
    return this.grade != undefined && this.grade != null;
});

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);