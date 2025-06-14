import React, { useState } from 'react';
import FeatureHub from './FeatureHub';

import { Search, Menu, X, User, HelpCircle, UserPlus, Eye, EyeOff, Home } from 'lucide-react';

type PageType = 'home' | 'login' | 'register' | 'help' | 'personalized-learning' | 'advanced-search' | 'feature-hub';

const EduPathApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [featureHubInitialView, setFeatureHubInitialView] = useState<'home' | 'search' | 'topics'>('home');
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Login attempt:', loginForm);
    // Add login logic here
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Register attempt:', registerForm);
    // Add register logic here
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  // Navigate to FeatureHub with specific initial view
  const navigateToFeatureHub = (initialView: 'home' | 'search' | 'topics') => {
    setFeatureHubInitialView(initialView);
    setCurrentPage('feature-hub');
    setIsMenuOpen(false);
  };

  // Handle back to home from FeatureHub
  const handleBackToHome = () => {
    setCurrentPage('home');
    setFeatureHubInitialView('home');
  };

  // Homepage Component
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">EduPath</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your personalized learning journey starts here. Discover courses, track progress, and achieve your educational goals.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, topics, or instructors..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {/* Personalized Learning Card - Navigate to Browse by Topics */}
          <div 
            onClick={() => navigateToFeatureHub('topics')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <User className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Learning</h3>
            <p className="text-gray-600">
              Get customized course recommendations based on your interests, goals, and learning style.
            </p>
          </div>
          
          {/* Advanced Search Card - Navigate to Featured Tools */}
          <div 
            onClick={() => navigateToFeatureHub('search')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Search className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Search</h3>
            <p className="text-gray-600">
              Find exactly what you're looking for with our powerful search and filtering capabilities.
            </p>
          </div>

          {/* 24/7 Support Card - Navigate to Help Page */}
          <div 
            onClick={() => navigateTo('help')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <HelpCircle className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
            <p className="text-gray-600">
              Get help whenever you need it with our comprehensive support system and community.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to start your learning journey?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigateTo('register')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigateTo('help')}
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigateTo('register')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </button>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleLogin}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Register Page Component
  const RegisterPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigateTo('login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to existing account
            </button>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleRegister}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Help Page Component
  const HelpPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Help Center</h2>
          <p className="text-xl text-gray-600">Find answers to common questions and get support</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• How to create an account</li>
                <li>• Setting up your profile</li>
                <li>• Finding your first course</li>
                <li>• Navigating the platform</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Account & Billing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Managing your subscription</li>
                <li>• Payment methods</li>
                <li>• Refund policy</li>
                <li>• Account settings</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h3>
            <p className="text-gray-600 mb-4">Can't find what you're looking for? Our support team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'help':
        return <HelpPage />;
      case 'feature-hub':
        return <FeatureHub initialView={featureHubInitialView} onBackToHome={handleBackToHome} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigateTo('home')}
                className="text-3xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                EduPath
              </button>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigateTo('home')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <Home size={20} />
                <span>Home</span>
              </button>
              <button 
                onClick={() => navigateTo('login')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <User size={20} />
                <span>Login</span>
              </button>
              <button 
                onClick={() => navigateTo('register')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <UserPlus size={20} />
                <span>Register</span>
              </button>
              <button 
                onClick={() => navigateTo('help')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <HelpCircle size={20} />
                <span>Help</span>
              </button>
            </nav>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => navigateTo('home')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <Home size={20} />
                  <span>Home</span>
                </button>
                <button 
                  onClick={() => navigateTo('login')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <User size={20} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <UserPlus size={20} />
                  <span>Register</span>
                </button>
                <button 
                  onClick={() => navigateTo('help')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <HelpCircle size={20} />
                  <span>Help</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {renderCurrentPage()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">EduPath</h4>
            <p className="text-gray-400">Empowering learners worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EduPathApp;