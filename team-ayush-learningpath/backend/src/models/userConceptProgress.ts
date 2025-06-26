import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a single concept progress document for a user.
 */
export interface IUserConceptProgress extends Document {
  userId: mongoose.Types.ObjectId;        // Reference to the user
  conceptId: mongoose.Types.ObjectId;     // Reference to the concept
  score: number;                   // Value from 0 (not mastered) to 1 (fully mastered)
  attempts: number;                       // Number of quiz attempts on this concept
  lastUpdated: Date;                      // Timestamp of last update
}

/**
 * Schema for tracking an individual user's progress on a specific concept.
 * This enables personalized learning path recommendations.
 */
const UserConceptProgressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one doc per user
  },
  concepts: [
    {
      conceptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concept',
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      attempts: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });


// Ensure a user can't have duplicate progress records for the same concept
UserConceptProgressSchema.index({ userId: 1, conceptId: 1 }, { unique: true });

/**
 * Mongoose model for UserConceptProgress.
 */
const UserConceptProgress = mongoose.model<IUserConceptProgress>(
  'UserConceptProgress',
  UserConceptProgressSchema
);

export default UserConceptProgress;
