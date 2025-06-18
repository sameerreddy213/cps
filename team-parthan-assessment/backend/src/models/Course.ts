import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  _id: string; 
  name: string;
  prerequisites: string[]; 
}

const schema = new Schema<ICourse>({
  _id: { type: String, required: true }, 
  name: { type: String, required: true },
  prerequisites: [{ type: String }]
});

export default mongoose.model<ICourse>('Course', schema);
