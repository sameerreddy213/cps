import mongoose, { Schema, Document, Model } from "mongoose";
import { OptionTag, Role, CourseStatus } from "../types/customTypes";

interface QuizInfo {
    quizId: mongoose.Types.ObjectId;
    userScore: number;
    userAnswers: OptionTag[];
}

interface CourseInfo {
    courseId: mongoose.Types.ObjectId;
    status: CourseStatus;
    result: number;
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    quizzes: QuizInfo[];
    customQuizzes: QuizInfo[];
    courses: CourseInfo[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        quizzes: [
            {
                quizId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Quiz',
                    required: true
                },
                userScore: {
                    type: Number,
                    default: 0
                },
                userAnswers: [
                    {
                        type: String,
                        enum: ['A', 'B', 'C', 'D']
                    }
                ]
            }
        ],
        customQuizzes: [
            {
                quizId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Quiz',
                    required: true
                },
                userScore: {
                    type: Number,
                    default: 0
                },
                userAnswers: [
                    {
                        type: String,
                        enum: ['A', 'B', 'C', 'D']
                    }
                ]
            }
        ],
        courses: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                },
                status: {
                    type: String,
                    enum: ['enrolled', 'completed', 'in-progress']
                },
                result: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
export default User;