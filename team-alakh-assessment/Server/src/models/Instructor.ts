import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  speciality: { type: String, required: true },
  degrees: { type: String, required: true },
  experience: { type: Number, required: true },
  profile: {
    picture: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  auditLogs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      details: mongoose.Schema.Types.Mixed,
    }
  ],
  managedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  managedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prerequisite' }],
}, { timestamps: true });

export default mongoose.model('Instructor', instructorSchema); 