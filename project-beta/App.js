import React, { useState, useEffect } from 'react';
import SignInPage from './components/SignIn/SignInPage';
   import PasswordStrengthChecker from './components/PasswordStrengthChecker'; 

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    const [showSignInPage, setShowSignInPage] = useState(false);
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || 'User Name';
    });
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('email') || 'user@example.com';
    });
    const [profilePic, setProfilePic] = useState(() => {
        return localStorage.getItem('profilePic') || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-user'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E`;
    });
    const [streak, setStreak] = useState(() => {
        return parseInt(localStorage.getItem('streak_last_login_count') || '0', 10);
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [faqStates, setFaqStates] = useState({
        faq1: false,
        faq2: false,
        faq3: false,
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        updateLoginStreak();
        // Set an interval to update streak daily
        const interval = setInterval(updateLoginStreak, 24 * 60 * 60 * 1000); 
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const handleEmailValidation = (e) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(!emailPattern.test(e.target.value));
    };

    const submitCreateAccount = () => {
        const usernameInput = document.getElementById('signup-username').value;
        const emailInput = document.getElementById('signup-email').value;
        const passwordInput = document.getElementById('signup-password').value;
        const confirmPasswordInput = document.getElementById('confirm-password').value;

        if (passwordInput !== confirmPasswordInput) {
            alert('Passwords do not match!');
            return;
        }
        if (!usernameInput || !emailInput || !passwordInput) {
            alert('Please fill in all fields.');
            return;
        }
        if (emailError) {
            alert('Please enter a valid email.');
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', usernameInput);
        localStorage.setItem('email', emailInput);
        setIsLoggedIn(true);
        setUsername(usernameInput);
        setEmail(emailInput);
        setShowCreateAccountModal(false);
        alert('Account created successfully!');
        setShowSignInPage(false);
    };

    const submitSignIn = () => {
        const usernameEmailInput = document.getElementById('signin-username-email').value;
        const passwordInput = document.getElementById('signin-password').value;

        if (!usernameEmailInput || !passwordInput) {
            alert('Please enter username/email and password.');
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', usernameEmailInput.split('@')[0]);
        localStorage.setItem('email', usernameEmailInput);
        setIsLoggedIn(true);
        setUsername(usernameEmailInput.split('@')[0]);
        setEmail(usernameEmailInput);
        setShowSignInModal(false);
        alert('Signed in successfully!');
        setShowSignInPage(false);
    };

    const signOut = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('profilePic');
        localStorage.removeItem('streak_last_login');
        localStorage.removeItem('streak_last_login_count');
        setIsLoggedIn(false);
        setUsername('User Name');
        setEmail('user@example.com');
        setProfilePic(`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-user'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E`);
        setStreak(0);
        alert('Signed out.');
    };

    const toggleFAQ = (faqId) => {
        setFaqStates(prevState => ({
            ...prevState,
            [faqId]: !prevState[faqId]
        }));
    };

    const updateLoginStreak = () => {
        const streakKey = 'streak_last_login';
        let lastLogin = localStorage.getItem(streakKey);
        const today = new Date().toISOString().split('T')[0];
        let currentStreak = parseInt(localStorage.getItem(`${streakKey}_count`) || '0', 10);

        if (today > lastLogin) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastLogin === yesterday) {
                currentStreak++;
            } else if (lastLogin !== today) {
                currentStreak = 1;
            }
            localStorage.setItem(streakKey, today);
            localStorage.setItem(`${streakKey}_count`, currentStreak);
        }
        setStreak(currentStreak);
    };

    const previewProfileImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfileChanges = () => {
        const newUsername = document.getElementById('edit-username').value;
        const newEmail = document.getElementById('edit-email').value;

        localStorage.setItem('username', newUsername);
        localStorage.setItem('email', newEmail);
        localStorage.setItem('profilePic', profilePic); // Save the base64 string
        
        setUsername(newUsername);
        setEmail(newEmail);
        setShowProfileModal(false);
        alert('Profile updated successfully!');
    };

    const viewProgress = () => {
        alert('Viewing progress! (Feature placeholder)');
        setShowProfileModal(false);
    };

    const generatePath = () => {
        const courseName = document.getElementById('course-input').value.trim();
        if (!courseName) {
            alert('Please enter a course name.');
            return;
        }
        alert(`Generating path for ${courseName}! (Feature placeholder)`);
        document.getElementById('path-message').classList.remove('hidden');
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <style jsx>{`
                body {
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(45deg, #dbeafe, #f3e8ff, #e0f2fe, #f0f9ff);
                    background-size: 400% 400%;
                    animation: gradientAnimation 15s ease infinite;
                    transition: background 0.3s ease, color 0.3s ease;
                }
                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                body.dark {
                    background: linear-gradient(45deg, #1e293b, #334155, #475569, #1e293b);
                    background-size: 400% 400%;
                    animation: gradientAnimation 15s ease infinite;
                    color: #e2e8f0;
                }
                .navbar {
                    transition: all 0.4s ease;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }
                .dark .navbar { background: rgba(30, 41, 59, 0.95); }
                .navbar:hover { box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }
                .dark .navbar:hover { box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1); }
                .nav-link {
                    position: relative;
                    padding-bottom: 4px;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: 0;
                    left: 50%;
                    background-color: #2dd4bf;
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                .nav-link:hover::after { width: 70%; }
                .card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
                    background: #ffffff;
                }
                .dark .card { background: #334155; }
                .card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                }
                .dark .card:hover {
                    box-shadow: 0 12px 24px rgba(255, 255, 255, 0.15);
                    background: linear-gradient(135deg, #475569, #1e293b);
                }
                .btn-primary {
                    transition: all 0.3s ease;
                    background: #2dd4bf;
                }
                .btn-primary:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 20px rgba(45, 212, 191, 0.4);
                    background: #14b8a6;
                }
                .hero-section {
                    background: #6366f1;
                    position: relative;
                }
                .animate-slide-up {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: slideUp 0.8s ease forwards;
                }
                @keyframes slideUp {
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    opacity: 0;
                    animation: fadeIn 1s ease forwards;
                }
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
                .feature-card {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: slideUpFeature 0.8s ease forwards;
                }
                @keyframes slideUpFeature {
                    to { opacity: 1; transform: translateY(0); }
                }
                .faq-item {
                    transition: background 0.3s ease;
                    background: #ffffff;
                    border-color: #e5e7eb;
                }
                .dark .faq-item {
                    background: #334155;
                    border-color: #475569;
                }
                .faq-item:hover { background: #f0f9ff; }
                .dark .faq-item:hover { background: #475569; }
                .faq-answer {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }
                .faq-answer.open { max-height: 200px; }
                .faq-toggle::after {
                    content: '▼';
                    display: inline-block;
                    margin-left: 8px;
                    transition: transform 0.3s ease;
                }
                .faq-toggle.open::after { transform: rotate(180deg); }
                .dark .bg-white { background: #1e293b; }
                .dark .bg-gray-50 { background: #334155; }
                .dark .text-gray-800 { color: #e2e8f0; }
                .dark .text-gray-600 { color: #94a3b8; }
                .dark .text-indigo-600 { color: #2dd4bf; }
                .dark .border { border-color: #475569; }
                .modal { transition: opacity 0.3s ease; z-index: 1000; }
                .modal-content, .sign-in-modal-content {
                    position: relative;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    max-width: 24rem;
                    width: 100%;
                }
                .modal-content { max-width: 28rem; }
                .dark .modal-content, .dark .sign-in-modal-content {
                    background: #1e293b;
                }
                .close-btn {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                    transition: color 0.3s ease;
                }
                .dark .close-btn {
                    color: #ffffff;
                }
                .close-btn:hover { color: #1f2937; }
                .dark .close-btn:hover { color: #f0f9ff; }
                .cancel-btn {
                    padding: 0.5rem 1rem;
                    background: #e5e7eb;
                    color: #1f2937;
                    border: none;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    transition: background 0.3s ease, color 0.3s ease;
                }
                .dark .cancel-btn {
                    background: #6b7280;
                    color: #ffffff;
                    border: 1px solid #9ca3af;
                }
                .cancel-btn:hover {
                    background: #d1d5db;
                }
                .dark .cancel-btn:hover {
                    background: #9ca3af;
                    color: #1f2937;
                }
                .social-btn {
                    transition: background 0.3s ease;
                    padding: 0.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 50%;
                }
                .social-btn:hover { background: #e5e7eb; }
                .dark .social-btn:hover { background: #475569; }
                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: none;
                }
                input {
                    color: #1f2937;
                    background: #ffffff;
                }
                .dark input {
                    color: #ffffff;
                    background: #2d3748;
                    border: 1px solid #4a5568;
                }
                .dark input[type="password"] {
                    -webkit-text-security: circle;
                    -moz-text-security: circle;
                    text-security: circle;
                    color: #e2e8f0;
                }
                .dark label {
                    color: #e2e8f0;
                }
                .profile-pic {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    object-fit: cover;
                    cursor: pointer;
                    border: 2px solid #4b5563;
                }
                .dark .profile-pic {
                    border-color: #e2e8f0;
                }
                .dropdown {
                    position: absolute;
                    top: 3.5rem;
                    right: 1.5rem;
                    background: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    min-width: 12rem;
                    z-index: 1000;
                }
                .dark .dropdown { background: #334155; }
                .dropdown-item {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .dropdown-item:hover { background: #f0f9ff; }
                .dark .dropdown-item:hover { background: #475569; }
                .default-profile-pic {
                    background: linear-gradient(135deg, #4b5563, #9ca3af);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    font-weight: bold;
                    border: 2px solid #4b5563;
                }
                .dark .default-profile-pic {
                    background: linear-gradient(135deg, #475569, #1e293b);
                    color: #ffffff;
                    border: 2px solid #e2e8f0;
                }
                .streak-logo {
                    width: 1.75rem;
                    height: 1.75rem;
                    background: #f0f0f0;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #000000;
                    font-size: 0.875rem;
                    margin-left: 0.5rem;
                    cursor: pointer;
                    position: relative;
                    border: 1px solid #4b5563;
                }
                .dark .streak-logo {
                    background: #475569;
                    color: #ffffff;
                    border-color: #e2e8f0;
                }
                .streak-popup {
                    display: none;
                    position: absolute;
                    bottom: -2.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffffff;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    z-index: 1001;
                }
                .dark .streak-popup {
                    background: #1e293b;
                    color: #e2e8f0;
                }
                .streak-logo:hover .streak-popup {
                    display: block;
                }
                .course-input {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    margin-bottom: 0.5rem;
                }
                .dark .course-input {
                    background: #2d3748;
                    border-color: #4a5568;
                    color: #e2e8f0;
                }
                .testimonial-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    background: #ffffff;
                }
                .dark .testimonial-card { background: #334155; }
                .testimonial-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                .dark .testimonial-card:hover { box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1); }
            `}</style>

            {/* Navbar */}
            <nav className="navbar sticky top-0 z-50 py-4 px-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-3xl font-bold text-indigo-600">LearnPath</div>
                    <div className="flex space-x-8 items-center">
                        <a href="#home" className="nav-link text-gray-800 hover:text-indigo-600 font-medium">Home</a>
                        <a href="#features" className="nav-link text-gray-800 hover:text-indigo-600 font-medium">Features</a>
                        <a href="#about" className="nav-link text-gray-800 hover:text-indigo-600 font-medium">About</a>
                        <div id="auth-section">
                            {!isLoggedIn ? (
                                <a href="#sign-in" id="sign-in-link" className="nav-link text-gray-800 hover:text-indigo-600 font-medium" onClick={(e) => { e.preventDefault(); setShowSignInModal(true); }}>Sign In</a>
                            ) : (
                                <div id="profile-section" className="relative">
                                    <div className="flex items-center space-x-2">
                                        <img
                                            id="profile-pic"
                                            src={profilePic}
                                            alt="Profile Picture"
                                            className={`profile-pic ${profilePic.includes('data:image/svg+xml') ? 'default-profile-pic' : ''}`}
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        />
                                        <div id="streak-logo" className="streak-logo">
                                            <span>🔥{streak}</span>
                                            <span className="streak-popup" id="streak-popup">Login Streak: {streak} day{streak !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                    {isDropdownOpen && (
                                        <div id="dropdown" className="dropdown">
                                            <div className="dropdown-item" onClick={() => { setShowProfileModal(true); setIsDropdownOpen(false); }}>My Profile</div>
                                            <div className="dropdown-item" onClick={viewProgress}>View Progress</div>
                                            <div className="dropdown-item" onClick={signOut}>Sign Out</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {!isLoggedIn && (
                             <a href="#try" id="try-link" className="nav-link text-gray-800 hover:text-indigo-600 font-medium">Try LearnPath Now</a>
                        )}
                       
                        <button id="themeToggle" className="focus:outline-none" onClick={toggleTheme}>
                            <svg id="themeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-800">
                                {isDarkMode ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.105 10.158A7.95 7.95 0 0112 20a8 8 0 010-16 7.95 7.95 0 018.105 10.158z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            
            {showSignInPage ? (
                <SignInPage />
            ) : (
                // Main application content
                <>
                  {/* Home Section */}
                  <section id="home" className="hero-section py-20 text-white relative">
                      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between hero-content">
                          <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
                              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 fade-in-up">
                                  Your Journey to Mastery with <span className="text-teal-300">AI-Powered</span> Learning
                              </h1>
                              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                                  Discover a tailored learning experience designed to unlock your full potential with AI-powered personalization.
                              </p>
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <button className="btn-primary text-white px-8 py-4 rounded-full text-lg font-medium" onClick={() => setShowCreateAccountModal(true)}>
                                      Get Started
                                  </button>
                              </div>
                          </div>
                          <div className="relative">
                              <div className="image-container">
                                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                      alt="Students collaborating"
                                      className="w-full h-96 object-cover rounded-xl shadow-2xl" />
                              </div>
                              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                                  <div className="flex items-center space-x-2">
                                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                      <span className="text-sm font-medium text-gray-800">50,000+ Active Learners</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* Features Section */}
                  <section id="features" className="py-16 bg-white">
                      <div className="container mx-auto px-6">
                          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in">Why Choose LearnPath?</h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                              <div className="card feature-card p-8 rounded-xl shadow-lg" style={{ animationDelay: '0.2s' }}>
                                  <h3 className="text-2xl font-semibold mb-4 text-indigo-600">Personalized Experience</h3>
                                  <p className="text-gray-600">Tailored recommendations to match your learning style and goals.</p>
                              </div>
                              <div className="card feature-card p-8 rounded-xl shadow-lg" style={{ animationDelay: '0.4s' }}>
                                  <h3 className="text-2xl font-semibold mb-4 text-indigo-600">Interactive Assessments</h3>
                                  <p className="text-gray-600">Engage with dynamic tests to track and boost your progress.</p>
                              </div>
                              <div className="card feature-card p-8 rounded-xl shadow-lg" style={{ animationDelay: '0.6s' }}>
                                  <h3 className="text-2xl font-semibold mb-4 text-indigo-600">Guided Learning</h3>
                                  <p className="text-gray-600">Follow a clear, customized path to achieve academic success.</p>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* About Section */}
                  <section id="about" className="py-16 bg-gray-50">
                      <div className="container mx-auto px-6">
                          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">About Our Site</h2>
                          <div className="flex flex-col md:flex-row items-center gap-8">
                              <div className="md:w-1/2">
                                  <img src="https://source.unsplash.com/random/600x400/?learning,team" alt="About LearnPath" className="rounded-lg shadow-lg w-full" />
                              </div>
                              <div className="md:w-1/2">
                                  <p className="text-gray-600 text-lg">
                                      LearnPath is dedicated to empowering students by providing personalized learning experiences. Our platform leverages advanced technology to help you master any subject with ease. Whether you're a beginner or an advanced learner, we guide you through a journey tailored to your needs, ensuring you achieve your academic goals.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* FAQs Section */}
                  <section id="faq" className="py-16 bg-white">
                      <div className="container mx-auto px-6">
                          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
                          <div className="space-y-4 max-w-2xl mx-auto">
                              <div className="faq-item p-6 border rounded-lg cursor-pointer" onClick={() => toggleFAQ('faq1')}>
                                  <h3 className={`faq-toggle text-xl font-semibold text-indigo-600 ${faqStates.faq1 ? 'open' : ''}`}>How does LearnPath personalize my learning?</h3>
                                  <div className={`faq-answer ${faqStates.faq1 ? 'open' : ''}`} style={{ maxHeight: faqStates.faq1 ? '200px' : '0' }}>
                                      <p className="text-gray-600 mt-2">We analyze your learning style and goals to recommend a path that suits you best, ensuring efficient and effective learning.</p>
                                  </div>
                              </div>
                              <div className="faq-item p-6 border rounded-lg cursor-pointer" onClick={() => toggleFAQ('faq2')}>
                                  <h3 className={`faq-toggle text-xl font-semibold text-indigo-600 ${faqStates.faq2 ? 'open' : ''}`}>Can I track my progress?</h3>
                                  <div className={`faq-answer ${faqStates.faq2 ? 'open' : ''}`} style={{ maxHeight: faqStates.faq2 ? '200px' : '0' }}>
                                      <p className="text-gray-600 mt-2">Yes, our platform provides detailed insights into your progress, helping you understand your strengths and areas for improvement.</p>
                                  </div>
                              </div>
                              <div className="faq-item p-6 border rounded-lg cursor-pointer" onClick={() => toggleFAQ('faq3')}>
                                  <h3 className={`faq-toggle text-xl font-semibold text-indigo-600 ${faqStates.faq3 ? 'open' : ''}`}>Is LearnPath suitable for all subjects?</h3>
                                  <div className={`faq-answer ${faqStates.faq3 ? 'open' : ''}`} style={{ maxHeight: faqStates.faq3 ? '200px' : '0' }}>
                                      <p className="text-gray-600 mt-2">Absolutely! We cover a wide range of subjects and topics, making it suitable for learners of all levels and disciplines.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>
              

                  {/* Try Section */}
                  <section id="try" className="py-16 bg-gray-50">
                      <div className="container mx-auto px-6">
                          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Try LearnPath Now</h2>
                          <div className="max-w-md mx-auto">
                              <div className="card p-6 rounded-xl shadow-lg">
                                  <div className="mb-4">
                                      <input type="text" id="course-input" className="course-input" placeholder="Enter a course name" required />
                                  </div>
                                  <button id="generate-path-btn" className="btn-primary text-white px-6 py-2 rounded-lg w-full" onClick={generatePath}>Generate Path</button>
                              </div>
                              <div id="path-message" className="text-center mt-4 text-gray-600 hidden">
                                  <span role="img" aria-label="target">🎯</span>
                                  <p>Ready to visualize your path?</p>
                                  <p>Enter a course name above and click "Generate Path"!</p>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* What Our Users Say Section */}
                  <section id="testimonials" className="py-16 bg-white">
                      <div className="container mx-auto px-6">
                          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in">What Our Users Say</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="testimonial-card p-6 rounded-xl shadow-lg">
                                  <p className="text-gray-600 italic mb-4">"LearnPath transformed my study plan! The personalized recommendations are spot on."</p>
                                  <p className="text-indigo-600 font-semibold">- Anjali K.</p>
                              </div>
                              <div className="testimonial-card p-6 rounded-xl shadow-lg">
                                  <p className="text-gray-600 italic mb-4">"The guided learning path saved me hours of confusion. Highly recommend!"</p>
                                  <p className="text-indigo-600 font-semibold">- Rahul S.</p>
                              </div>
                          </div>
                      </div>
                  </section>
                  </>
            )}

            {/* Footer */}
            <footer className="bg-indigo-600 text-white py-10">
                <div className="container mx-auto text-center">
                    <div className="mb-4">LearnPath</div>
                    <p className="mb-4">© 2025 Made with ❤️ by Students for students</p>
                    <div className="space-x-6">
                        <a href="#terms" className="hover:text-indigo-200 transition-colors">Terms and Conditions</a>
                        <a href="#privacy" className="hover:text-indigo-200 transition-colors">Privacy Policy</a>
                        <a href="#contact" className="hover:text-indigo-200 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

            {/* Create Account Modal */}
            {showCreateAccountModal && (
            <div id="createAccountModal" className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="modal-content">
                    <button className="close-btn" onClick={() => setShowCreateAccountModal(false)}>×</button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Create Account</h2>
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="signup-username">Username</label>
                            <input type="text" id="signup-username" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter your username" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="signup-email">Email</label>
                            <input type="email" id="signup-email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter your email" required onChange={handleEmailValidation} />
                            {emailError && <p id="email-error" className="error-message" style={{ display: 'block' }}>Please enter a valid email (e.g., user@example.com).</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="signup-password">Password</label>
                            <input
                                type="password"
                                id="signup-password"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                placeholder="Enter your password"
                                required
                                onChange={(e) => setPassword(e.target.value)} // Assuming you have a state for password
                            />
                            <PasswordStrengthChecker password={password} setPassword={setPassword} /> {/* Pass setPassword here */}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Confirm your password" required />
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button className="cancel-btn" onClick={() => setShowCreateAccountModal(false)}>Cancel</button>
                            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={submitCreateAccount}>Sign Up</button>
                        </div>
                        <p className="text-center mt-4 dark:text-gray-300">
                            Already have an account?
                            <a href="#" className="text-indigo-600 hover:underline dark:text-teal-400" onClick={(e) => { e.preventDefault(); setShowCreateAccountModal(false); setShowSignInModal(true); }}>Sign In</a>
                        </p>
                        <div className="mt-6">
                            <p className="text-center text-gray-600 mb-4 dark:text-gray-300">Or sign up with</p>
                            <div className="flex justify-center space-x-4">
                                <button className="social-btn" onClick={() => alert('Facebook sign up (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6" /></button>
                                <button className="social-btn" onClick={() => alert('Google sign up (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6" /></button>
                                <button className="social-btn" onClick={() => alert('X sign up (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg" alt="X" className="w-6 h-6" /></button>
                                <button className="social-btn" onClick={() => alert('GitHub sign up (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="w-6 h-6" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}


            {/* Sign In Modal */}
            {showSignInModal && (
                <div id="signInModal" className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="sign-in-modal-content">
                        <button className="close-btn" onClick={() => setShowSignInModal(false)}>×</button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Sign In</h2>
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="signin-username-email">Username or Email</label>
                                <input type="text" id="signin-username-email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter your username or email" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="signin-password">Password</label>
                                <input type="password" id="signin-password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter your password" required />
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <input type="checkbox" id="remember-me" className="h-4 w-4 text-indigo-600 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 text-gray-700 dark:text-gray-300">Remember me</label>
                                </div>
                                <a href="#" className="text-indigo-600 hover:underline dark:text-teal-400">Forgot Password?</a>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button className="cancel-btn" onClick={() => setShowSignInModal(false)}>Cancel</button>
                                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={submitSignIn}>Sign In</button>
                            </div>
                            <p className="text-center mt-4 dark:text-gray-300">
                                Don't have an account?
                                <a href="#" className="text-indigo-600 hover:underline dark:text-teal-400" onClick={(e) => { e.preventDefault(); setShowSignInModal(false); setShowCreateAccountModal(true); }}>Sign Up</a>
                            </p>
                            <div className="mt-6">
                                <p className="text-center text-gray-600 mb-4 dark:text-gray-300">Or sign in with</p>
                                <div className="flex justify-center space-x-4">
                                    <button className="social-btn" onClick={() => alert('Facebook sign in (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6" /></button>
                                    <button className="social-btn" onClick={() => alert('Google sign in (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6" /></button>
                                    <button className="social-btn" onClick={() => alert('X sign in (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg" alt="X" className="w-6 h-6" /></button>
                                    <button className="social-btn" onClick={() => alert('GitHub sign in (placeholder)')}><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="w-6 h-6" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <div id="profileModal" className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="modal-content max-w-lg">
                        <button className="close-btn" onClick={() => setShowProfileModal(false)}>×</button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">My Profile</h2>
                        <div className="flex flex-col items-center">
                            <img id="profile-modal-pic" src={profilePic} alt="Profile Picture" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-indigo-600" />
                            <label htmlFor="profile-image-upload" className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mb-4">
                                Upload New Picture
                                <input type="file" id="profile-image-upload" accept="image/*" className="hidden" onChange={previewProfileImage} />
                            </label>
                            <div className="text-center mb-4">
                                <p className="text-gray-800 font-semibold text-lg dark:text-white" id="profile-modal-username">{username}</p>
                                <p className="text-gray-600 text-sm dark:text-gray-300" id="profile-modal-email">{email}</p>
                            </div>
                            <div className="w-full">
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="edit-username">Edit Username</label>
                                    <input type="text" id="edit-username" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" defaultValue={username} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 dark:text-gray-300" htmlFor="edit-email">Edit Email</label>
                                    <input type="email" id="edit-email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" defaultValue={email} />
                                </div>
                                <div className="flex justify-center space-x-4">
                                    <button className="cancel-btn" onClick={() => setShowProfileModal(false)}>Cancel</button>
                                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={saveProfileChanges}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
