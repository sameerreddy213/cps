//developed by sahithya
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB with error handling
mongoose.connect('mongodb://localhost:27017/learnpath', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    socialId: { type: String },
    signupMethod: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Register User (Form or Social)
app.post('/api/users/register', async (req, res) => {
    console.log('Received register request:', req.body); // Log incoming request
    try {
        const { username, email, password, socialId, signupMethod } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already exists:', email);
            return res.status(400).json({ message: 'Email already exists.' });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully');
        }

        const user = new User({
            username,
            email,
            password: hashedPassword,
            socialId,
            signupMethod,
        });

        await user.save();
        console.log('User saved successfully:', user);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login User (Form)
app.post('/api/users/login', async (req, res) => {
    console.log('Received login request:', req.body);
    try {
        const { usernameEmail, password } = req.body;

        const user = await User.findOne({
            $or: [{ username: usernameEmail }, { email: usernameEmail }],
            signupMethod: 'form',
        });

        if (!user || !user.password) {
            console.log('User not found or no password:', usernameEmail);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', usernameEmail);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        console.log('Login successful for:', usernameEmail);
        res.status(200).json({ message: 'Login successful.' });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Social Login
app.post('/api/users/social-login', async (req, res) => {
    console.log('Received social-login request:', req.body);
    try {
        const { socialId, signupMethod } = req.body;

        const user = await User.findOne({ socialId, signupMethod });
        if (!user) {
            console.log('Social account not found:', socialId);
            return res.status(401).json({ message: 'Social account not found.' });
        }

        console.log('Social login successful for:', socialId);
        res.status(200).json({ message: 'Social login successful.' });
    } catch (err) {
        console.error('Error in social-login:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
