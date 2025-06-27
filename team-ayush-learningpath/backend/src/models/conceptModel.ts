import { Schema, model } from 'mongoose';
import { IConcept } from '../types';

const conceptSchema = new Schema<IConcept>({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    contentBlocks: [{
        type: {
            type: String,
            required: false,
        },
        data: {
            type: String,
            required: false,
        }
    }],
    prerequisites: [{
        type: Schema.Types.ObjectId,
        ref: 'Concept'
    }],
    relatedConcepts: [{
        type: Schema.Types.ObjectId,
        ref: 'Concept'
    }],
    level: {
        type: String
    },
    category: {
        type: String
    },
    conceptType: {
        type: String
    },

    // ✅ Already present: keep as is
    estLearningTimeHours: {
        type: Number
    },

    // ✅ New: Complexity (scale 1-5)
    complexity: {
        type: Number,
        required: true,
        default: 3, // 1 = easy, 5 = hard
        min: 1,
        max: 5
    },

    // ✅ Optional: flag for curriculum graph logic
    isFundamental: {
        type: Boolean
    },

    learningResources: {
        type: String
    },

    quiz: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswerIndex: { type: Number, required: true },
        explanation: { type: String }
    }]
}, {
    timestamps: true
});

export default model<IConcept>('Concept', conceptSchema);




// /**
//  * The Concept schema represents a single, unique learning topic or course.
//  * It is the central repository for all content and quiz material.
//  */
// const conceptSchema = new Schema<IConcept>({
//     title: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     // The actual learning material, broken down into flexible blocks.
//     contentBlocks: [{
//         type: {
//             type: String, // e.g., 'text', 'video', 'image'
//             required: true,
//         },
//         data: {
//             type: String, // Can be raw text, a URL to a video, or an image URL
//             required: true,
//         }
//     }],
//     // Defines the knowledge graph by linking to other concepts
//     prerequisites: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Concept' // This creates a direct reference to other documents in this same collection
//     }],
//     // Each concept has its own test page (quiz) defined here.
//     quiz: [{
//         questionText: { type: String, required: true },
//         // An array of potential answers.
//         options: [{ type: String, required: true }],
//         // We only store the INDEX of the correct answer in the options array.
//         correctAnswerIndex: { type: Number, required: true },
//         // An optional explanation for why the answer is correct, shown after submission.
//         explanation: { type: String }
//     }]
// }, {
//     timestamps: true // Automatically adds createdAt and updatedAt fields
// });

// export default model<IConcept>('Concept', conceptSchema);


// ** For mastery layer with whatever complexity and shortest path

// const conceptSchema = new Schema<IConcept>({
//     title: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: false, // optional if not yet present
//         default: ''
//     },
//     contentBlocks: [{
//         type: {
//             type: String, // 'text', 'video', etc.
//             required: false,
//         },
//         data: {
//             type: String,
//             required: false,
//         }
//     }],
//     prerequisites: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Concept'
//     }],
//     relatedConcepts: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Concept'
//     }],
//     level: {
//         type: String
//     },
//     category: {
//         type: String
//     },
//     conceptType: {
//         type: String
//     },
//     estLearningTimeHours: {
//         type: Number
//     },
//     isFundamental: {
//         type: Boolean
//     },
//     learningResources: {
//         type: String
//     },
//     quiz: [{
//         questionText: { type: String, required: true },
//         options: [{ type: String, required: true }],
//         correctAnswerIndex: { type: Number, required: true },
//         explanation: { type: String }
//     }]
// }, {
//     timestamps: true
// });

// export default model<IConcept>('Concept', conceptSchema);
