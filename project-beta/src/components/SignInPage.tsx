import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Check, X, Mail, Lock, User, Lightbulb } from 'lucide-react';

interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const SignInPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Password validation regex patterns
  const passwordRegex = {
    minLength: /.{8,}/,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  };

  // Generate strong password
  const generateStrongPassword = (): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Fill remaining length with random characters
    const allChars = lowercase + uppercase + numbers + specialChars;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Generate multiple password suggestions
  const generatePasswordSuggestions = (): string[] => {
    const suggestions = [];
    for (let i = 0; i < 3; i++) {
      suggestions.push(generateStrongPassword());
    }
    return suggestions;
  };

  // Validate password criteria
  const validatePassword = (password: string): PasswordCriteria => {
    return {
      minLength: passwordRegex.minLength.test(password),
      hasUppercase: passwordRegex.hasUppercase.test(password),
      hasLowercase: passwordRegex.hasLowercase.test(password),
      hasNumber: passwordRegex.hasNumber.test(password),
      hasSpecialChar: passwordRegex.hasSpecialChar.test(password)
    };
  };

  // Check if password is weak and should show suggestions
  const shouldShowSuggestions = (password: string): boolean => {
    if (!password) return false;
    const criteria = validatePassword(password);
    const metCriteria = Object.values(criteria).filter(Boolean).length;
    return metCriteria < 3; // Show suggestions if less than 3 criteria are met
  };

  // Open password suggestion modal
  const openPasswordModal = () => {
    setPasswordSuggestions(generatePasswordSuggestions());
    setShowPasswordModal(true);
  };

  // Close password modal
  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      const criteria = validatePassword(value);
      setPasswordCriteria(criteria);
    }
  };

  // Use suggested password
  const setSuggestedPassword = (password: string) => {
  setFormData(prev => ({
    ...prev,
    password: password
  }));
  setPasswordCriteria(validatePassword(password));
  setShowPasswordModal(false);
};

  // Generate new suggestions
  const generateNewSuggestions = () => {
    setPasswordSuggestions(generatePasswordSuggestions());
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (isSignUp && !allCriteriaMet) {
      alert('Password does not meet all security requirements!');
      return;
    }

    console.log('Form submitted:', formData);
    alert(`${isSignUp ? 'Sign Up' : 'Sign In'} attempted! Check console for form data.`);
  };

  // Social authentication handlers
  const handleSocialAuth = (provider: string) => {
    console.log(`${provider} authentication initiated`);
    alert(`${provider} authentication would be handled here`);
  };

  const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-blue-100">
              {isSignUp ? 'Join us today' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                  {isSignUp && (
                    <button
                      type="button"
                      onClick={openPasswordModal}
                      className="ml-2 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Suggest Strong Password
                    </button>
                  )}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Criteria (Sign Up only) */}
              {isSignUp && formData.password && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Password Requirements:</span>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {[
                      { key: 'minLength', label: 'At least 8 characters' },
                      { key: 'hasUppercase', label: 'One uppercase letter (A-Z)' },
                      { key: 'hasLowercase', label: 'One lowercase letter (a-z)' },
                      { key: 'hasNumber', label: 'One number (0-9)' },
                      { key: 'hasSpecialChar', label: 'One special character (!@#$...)' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        {passwordCriteria[key as keyof PasswordCriteria] ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className={passwordCriteria[key as keyof PasswordCriteria] ? 'text-green-700' : 'text-gray-600'}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Authentication */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('Facebook')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('Microsoft')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M0 0h11.5v11.5H0z"/>
                  <path fill="#00A4EF" d="M12.5 0H24v11.5H12.5z"/>
                  <path fill="#7FBA00" d="M0 12.5h11.5V24H0z"/>
                  <path fill="#FFB900" d="M12.5 12.5H24V24H12.5z"/>
                </svg>
                Continue with Microsoft
              </button>
            </div>

            {/* Toggle Sign In/Sign Up */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Password Suggestion Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-xl font-bold text-white">Strong Password Suggestions</h2>
                </div>
                <p className="text-blue-100 text-sm">
                  Choose a secure password or generate new ones
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Click any password below to use it, or generate new suggestions:
                  </div>
                  
                  {/* Password Suggestions */}
                  <div className="space-y-3">
                    {passwordSuggestions.map((suggestion, index) => (
                      <div key={index} className="group">
                        <button
                          type="button"
                          onClick={() => setSuggestedPassword(suggestion)}
                          className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group-hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-mono text-lg font-medium text-gray-800 break-all">
                                {suggestion}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                  <Check className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-600 font-medium">Strong & Secure</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  • {suggestion.length} characters
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="text-blue-600 text-sm font-medium">
                                Use This →
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setPasswordSuggestions(generatePasswordSuggestions())}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Generate New
                    </button>
                    <button
                      type="button"
                      onClick={closePasswordModal}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Security Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Password Security Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• These passwords meet all security requirements</li>
                    <li>• Each contains uppercase, lowercase, numbers & symbols</li>
                    <li>• Store your password in a secure password manager</li>
                    <li>• Never share your password with anyone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Strength Indicator (Sign Up only) */}
        {isSignUp && formData.password && (
          <div className="mt-4 bg-white rounded-lg p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Password Strength</span>
              <span className={`text-sm font-medium ${isPasswordStrong ? 'text-green-600' : 'text-orange-600'}`}>
                {isPasswordStrong ? 'Strong' : 'Weak'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isPasswordStrong ? 'bg-green-500 w-full' : 'bg-orange-500 w-1/2'
                }`}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInPage;