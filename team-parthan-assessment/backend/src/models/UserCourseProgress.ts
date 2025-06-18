import mongoose, { Document, Schema } from 'mongoose';

export interface IUserCourseProgress extends Document {
  userId: string;
  mastered: string[];
  ready: string[];
}

const schema = new Schema<IUserCourseProgress>({
  userId: { type: String, required: true, unique: true },
  mastered: [String],
  ready: [String]
});

export default mongoose.model<IUserCourseProgress>('UserCourseProgress', schema);
