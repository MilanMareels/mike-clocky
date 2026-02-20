import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkDay extends Document {
  dateString: string;
  startTime: string;
  endTime: string;
  netHours: number;
  site?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkDaySchema = new Schema<IWorkDay>(
  {
    dateString: { type: String, required: true, unique: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    netHours: { type: Number, required: true },
    site: { type: String, required: false },
    note: { type: String, required: false },
  },
  { timestamps: true },
);

const WorkDay: Model<IWorkDay> = mongoose.models.WorkDay || mongoose.model<IWorkDay>("WorkDay", WorkDaySchema);

export default WorkDay;
