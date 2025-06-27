import mongoose, { Schema, Document } from 'mongoose';

export interface IQuery extends Document {
  studentId: Schema.Types.ObjectId;
  instructorId?: Schema.Types.ObjectId;
  content: string;
  attachments: { url: string; type: string }[];
  status: 'open' | 'under_progress' | 'solved' | 'irrelevant' | 'closed';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuerySchema = new Schema<IQuery>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  instructorId: { type: Schema.Types.ObjectId, ref: 'Instructor' },
  content: { type: String, required: true },
  attachments: [
    {
      url: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  status: {
    type: String,
    enum: ['open', 'under_progress', 'solved', 'irrelevant', 'closed'],
    default: 'open',
  },
  response: { type: String },
}, { timestamps: true });

export default mongoose.model<IQuery>('Query', QuerySchema); 