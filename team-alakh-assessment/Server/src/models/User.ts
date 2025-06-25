import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['mentor', 'learner'], 
    default: 'learner' 
  },
  passedArray: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' },
  },
  searchHistory: { type: [String], default: [] },
});

export default mongoose.model('User', userSchema);
