import mongoose, { Schema, Document, Model } from "mongoose";
import { OptionTag, Level, Language } from "../types/customTypes";

interface Option {
    optionText: string;
    optionTag: OptionTag;
}

interface Question {
    questionText: string;
    options: Option[];
    correctOption: OptionTag;
    score: number;
}

export interface QuizDocument extends Document {
    title: string;
    level: Level;
    language: Language;
    description?: string;
    topic: {
        courseID: mongoose.Types.ObjectId;
        courseName: string;
    }
    questions: Question[];
    createdAt: Date;
    updatedAt: Date;
    quizScore: number;
}

const quizSchema = new Schema<QuizDocument>(
    {
        title: {
            type: String,
            // required: true,
            trim: true
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true
        },
        language: {
            type: String,
            enum: ['cpp', 'python', 'javascript', 'java'],
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        topic: {
            courseID: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                default: null,
            },
            courseName: {
                type: String,
                default: 'basic',
                trim: true
            }
        },
        questions: [
            {
                questionText: { type: String, required: true },
                options: [
                    {
                        optionText: { type: String, required: true },
                        optionTag: {
                            type: String,
                            enum: ['A', 'B', 'C', 'D'],
                            required: true
                        }
                    }
                ],
                correctOption: {
                    type: String,
                    enum: ['A', 'B', 'C', 'D'],
                    required: true
                },
                score: {
                    type: Number,
                    default: 1,
                    min: 0
                }
            }
        ],
        quizScore: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Quiz: Model<QuizDocument> = mongoose.model<QuizDocument>("Quiz", quizSchema);

export default Quiz;
