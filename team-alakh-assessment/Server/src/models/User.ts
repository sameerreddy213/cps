import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passedArray: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' },
  },
  searchHistory: { type: [String], default: [] },
  flagged: { type: Boolean, default: false },
  deactivated: { type: Boolean, default: false },
});

export default mongoose.model('User', userSchema);
