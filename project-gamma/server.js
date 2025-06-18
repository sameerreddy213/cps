const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// In-memory storage (replace with database in production)
const users = new Map();
const sessions = new Map();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { error: 'Too many authentication attempts. Please try again later.' }
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Password validation function
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    return errors;
}

// Generate user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// JWT Token verification middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Get password requirements
app.get('/api/auth/password-requirements', (req, res) => {
    res.json({
        requirements: [
            'At least 8 characters long',
            'At least one uppercase letter (A-Z)',
            'At least one lowercase letter (a-z)',
            'At least one number (0-9)',
            'At least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'
        ]
    });
});

// Create Account Endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Input validation
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                error: 'All fields are required',
                fields: { username: !username, email: !email, password: !password, confirmPassword: !confirmPassword }
            });
        }

        // Username validation
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }

        // Password validation
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({
                error: 'Password does not meet requirements',
                passwordErrors: passwordErrors
            });
        }

        // Password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUserByEmail = Array.from(users.values()).find(user => user.email === email);
        const existingUserByUsername = Array.from(users.values()).find(user => user.username === username);

        if (existingUserByEmail) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        if (existingUserByUsername) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = generateUserId();
        const newUser = {
            id: userId,
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            isActive: true,
            profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
            progress: {}
        };

        users.set(userId, newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: userId, username: username, email: email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Store session
        sessions.set(userId, {
            token,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });

        res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: userId,
                username: username,
                email: email,
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt
            },
            token: token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

// Sign In Endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Input validation
        if (!usernameOrEmail || !password) {
            return res.status(400).json({
                error: 'Username/email and password are required',
                fields: { usernameOrEmail: !usernameOrEmail, password: !password }
            });
        }

        // Find user by username or email
        const user = Array.from(users.values()).find(user => 
            user.username === usernameOrEmail || user.email === usernameOrEmail.toLowerCase()
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid username/email or password' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Account has been deactivated. Please contact support.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username/email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update session
        sessions.set(user.id, {
            token,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });

        res.json({
            message: 'Sign in successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt
            },
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
    try {
        const user = users.get(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
                progress: user.progress
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Profile
app.put('/api/user/profile', authenticateToken, (req, res) => {
    try {
        const { username, email } = req.body;
        const user = users.get(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username && username !== user.username) {
            // Check if username is already taken
            const existingUser = Array.from(users.values()).find(u => u.username === username && u.id !== user.id);
            if (existingUser) {
                return res.status(409).json({ error: 'Username already taken' });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            // Validate email
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: 'Please enter a valid email address' });
            }
            
            // Check if email is already taken
            const existingUser = Array.from(users.values()).find(u => u.email === email && u.id !== user.id);
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' });
            }
            user.email = email.toLowerCase().trim();
        }

        users.set(user.id, user);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sign Out Endpoint
app.post('/api/auth/logout', authenticateToken, (req, res) => {
    try {
        sessions.delete(req.user.userId);
        res.json({ message: 'Signed out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify Token Endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ 
        valid: true, 
        user: { 
            userId: req.user.userId, 
            username: req.user.username, 
            email: req.user.email 
        } 
    });
});

// Course Graph Generation (mock implementation)
app.post('/api/course/generate-graph', authenticateToken, (req, res) => {
    try {
        const { courseName } = req.body;
        
        if (!courseName) {
            return res.status(400).json({ error: 'Course name is required' });
        }

        // Mock course data - in production, this would query a database or AI service
        const mockCourseData = {
            "Machine Learning": {
                nodes: [
                    { id: "ml", name: "Machine Learning", level: 0 },
                    { id: "stats", name: "Statistics", level: 1 },
                    { id: "linear_algebra", name: "Linear Algebra", level: 1 },
                    { id: "calculus", name: "Calculus", level: 2 },
                    { id: "python", name: "Python Programming", level: 1 },
                    { id: "basic_math", name: "Basic Mathematics", level: 2 }
                ],
                links: [
                    { source: "stats", target: "ml" },
                    { source: "linear_algebra", target: "ml" },
                    { source: "python", target: "ml" },
                    { source: "calculus", target: "stats" },
                    { source: "basic_math", target: "calculus" },
                    { source: "basic_math", target: "linear_algebra" }
                ]
            }
        };

        const courseData = mockCourseData[courseName] || {
            nodes: [
                { id: "course", name: courseName, level: 0 },
                { id: "foundation", name: "Foundation Knowledge", level: 1 }
            ],
            links: [
                { source: "foundation", target: "course" }
            ]
        };

        res.json({
            success: true,
            courseName: courseName,
            graph: courseData
        });

    } catch (error) {
        console.error('Course graph generation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        users: users.size,
        sessions: sessions.size
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
//app.all('*', (req, res) => {
    //res.status(404).json({ error: 'Endpoint not found' });
//});


// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`LearnPath Backend Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
