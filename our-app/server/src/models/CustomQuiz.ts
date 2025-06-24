import mongoose, { Schema, Document, Model } from "mongoose";

type OptionTag = 'A' | 'B' | 'C' | 'D';
type Language = 'cpp' | 'python' | 'javascript' | 'java';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface Option {
    optionText: string;
    optionTag: OptionTag;
}

interface CustomQuestion {
    questionText: string;
    options: Option[];
    correctOption: OptionTag;
    level: Difficulty;
    score: number;
    topic: mongoose.Types.ObjectId;
}

export interface CustomQuizDocument extends Document {
    title: string;
    description?: string;
    language: Language;
    customQuestions: CustomQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

const customQuizSchema = new Schema<CustomQuizDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        language: {
            type: String,
            enum: ['cpp', 'python', 'javascript', 'java'],
            required: true
        },
        customQuestions: [
            {
                questionText: {
                    type: String,
                    required: true
                },
                options: [
                    {
                        optionText: {
                            type: String,
                            required: true
                        },
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
                level: {
                    type: String,
                    enum: ['beginner', 'intermediate', 'advanced'],
                    required: true
                },
                score: {
                    type: Number,
                    default: 1,
                    min: 0
                },
                topic: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const CustomQuiz: Model<CustomQuizDocument> = mongoose.model<CustomQuizDocument>(
    "CustomQuiz",
    customQuizSchema
);

export default CustomQuiz;