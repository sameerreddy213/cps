import mongoose, { Schema, Document, Model } from "mongoose";

export interface CourseDocument extends Document {
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<CourseDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true
        },
        prerequisites: {
            type: [String],
            required: true,
            default: []
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Course: Model<CourseDocument> = mongoose.model<CourseDocument>('Course', courseSchema);
export default Course;
