import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IAssignments extends Document {
  title: string;
  description: string;
  dueDate: Date;
  createdDate: Date;
  teacherId: string;
  isOpen?: boolean; // וירטואלי
}

export const assignmentsSchema = new Schema({
  title: { type: Schema.Types.String },
  description: { type: Schema.Types.String, required: true },
  dueDate: { type: Schema.Types.Date, required: true },
  createdDate: { type: Schema.Types.Date, immutable: true, default: Date.now }, // יוצר תאריך אוטומטית בעת יצירת המסמך באופן שהמורה לא יכול לשנות אותו
  teacherId: { type: Schema.Types.String, required: true }
});

assignmentsSchema.virtual('isOpen').get(function (this: IAssignments) {
  const currentDate = new Date();
  return currentDate < this.dueDate;
});

assignmentsSchema.set('toJSON', { virtuals: true });
assignmentsSchema.set('toObject', { virtuals: true });

export const Assignments = mongoose.model<IAssignments>("Assignments", assignmentsSchema);