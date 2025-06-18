// Frontend JavaScript for LearnPath Authentication
// Add this script to your HTML file

class LearnPathAuth {
    constructor() {
        this.baseURL = 'http://localhost:3000/api'; // Change this to your backend URL
        this.token = localStorage.getItem('learnpath_token');
        this.currentUser = null;
        this.passwordRequirements = [];
        
        this.init();
    }

    async init() {
        await this.loadPasswordRequirements();
        if (this.token) {
            await this.verifyToken();
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form submissions
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const activeModal = document.querySelector('.modal:not(.hidden)');
                if (activeModal) {
                    if (activeModal.id === 'createAccountModal') {
                        this.submitCreateAccount();
                    } else if (activeModal.id === 'signInModal') {
                        this.submitSignIn();
                    }
                }
            }
        });

        // Real-time validation
        const emailInput = document.getElementById('signup-email');
        if (emailInput) {
            emailInput.addEventListener('input', this.validateEmail.bind(this));
        }

        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.validatePasswordRealTime.bind(this));
        }

        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', this.validatePasswordMatch.bind(this));
        }
    }

    async loadPasswordRequirements() {
        try {
            const response = await fetch(`${this.baseURL}/auth/password-requirements`);
            const data = await response.json();
            this.passwordRequirements = data.requirements || [];
        } catch (error) {
            console.error('Failed to load password requirements:', error);
            this.passwordRequirements = [
                'At least 8 characters long',
                'At least one uppercase letter',
                'At least one lowercase letter',
                'At least one number',
                'At least one special character'
            ];
        }
    }

    async verifyToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.updateUIForLoggedInUser();
            } else {
                this.clearAuth();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.clearAuth();
        }
    }

    showCreateAccountModal() {
        this.showPasswordInstructions();
        document.getElementById('createAccountModal').classList.remove('hidden');
        document.getElementById('signup-username').focus();
    }

    showSignInModal() {
        document.getElementById('signInModal').classList.remove('hidden');
        document.getElementById('signin-username-email').focus();
    }

    closeCreateAccountModal() {
        document.getElementById('createAccountModal').classList.add('hidden');
        this.clearForm('create-account');
        this.hidePasswordInstructions();
    }

    closeSignInModal() {
        document.getElementById('signInModal').classList.add('hidden');
        this.clearForm('sign-in');
    }

    showPasswordInstructions() {
        // Create password instructions dialog
        const existingDialog = document.getElementById('passwordInstructionsDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const dialog = document.createElement('div');
        dialog.id = 'passwordInstructionsDialog';
        dialog.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        dialog.innerHTML = `
            <div class="modal-content bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Password Requirements</h3>
                    <button onclick="learnPathAuth.hidePasswordInstructions()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-3">Your password must meet the following requirements:</p>
                    <ul class="space-y-2">
                        ${this.passwordRequirements.map(req => 
                            `<li class="flex items-center text-sm">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                ${req}
                            </li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="flex justify-end">
                    <button onclick="learnPathAuth.hidePasswordInstructions()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
    }

    hidePasswordInstructions() {
        const dialog = document.getElementById('passwordInstructionsDialog');
        if (dialog) {
            dialog.remove();
        }
    }

    async submitCreateAccount() {
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Client-side validation
        if (!username || !email || !password || !confirmPassword) {
            this.showError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        try {
            this.showLoading('Creating account...');

            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('learnpath_token', this.token);
                
                this.hideLoading();
                this.closeCreateAccountModal();
                this.updateUIForLoggedInUser();
                this.showSuccess('Account created successfully! Welcome to LearnPath!');
            } else {
                this.hideLoading();
                if (data.passwordErrors) {
                    this.showPasswordErrors(data.passwordErrors);
                } else {
                    this.showError(data.error || 'Failed to create account');
                }
            }
        } catch (error) {
            this.hideLoading();
            console.error('Registration error:', error);
            this.showError('Network error. Please check your connection and try again.');
        }
    }

    async submitSignIn() {
        const usernameOrEmail = document.getElementById('signin-username-email').value.trim();
        const password = document.getElementById('signin-password').value;

        if (!usernameOrEmail || !password) {
            this.showError('Please enter both username/email and password');
            return;
        }

        try {
            this.showLoading('Signing in...');

            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameOrEmail,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('learnpath_token', this.token);
                
                this.hideLoading();
                this.closeSignInModal();
                this.updateUIForLoggedInUser();
                this.showSuccess(`Welcome back, ${data.user.username}!`);
            } else {
                this.hideLoading();
                this.showError(data.error || 'Failed to sign in');
            }
        } catch (error) {
            this.hideLoading();
            console.error('Login error:', error);
            this.showError('Network error. Please check your connection and try again.');
        }
    }

    async signOut() {
        try {
            await fetch(`${this.baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearAuth();
        this.updateUIForLoggedOutUser();
        this.showSuccess('Signed out successfully');
    }

    clearAuth() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('learnpath_token');
    }

    updateUIForLoggedInUser() {
        const signInLink = document.getElementById('sign-in-link');
        const profileSection = document.getElementById('profile-section');
        const profilePic = document.getElementById('profile-pic');

        if (signInLink) signInLink.style.display = 'none';
        if (profileSection) {
            profileSection.classList.remove('hidden');
            if (profilePic && this.currentUser) {
                profilePic.src = this.currentUser.profilePicture || `https://api.dicebear.com/7.x/avatars/svg?seed=${this.currentUser.username}`;
                profilePic.alt = `${this.currentUser.username}'s Profile Picture`;
            }
        }
    }

    updateUIForLoggedOutUser() {
        const signInLink = document.getElementById('sign-in-link');
        const profileSection = document.getElementById('profile-section');
        const dropdown = document.getElementById('dropdown');

        if (signInLink) signInLink.style.display = 'inline';
        if (profileSection) profileSection.classList.add('hidden');
        if (dropdown) dropdown.classList.add('hidden');
    }

    toggleDropdown() {
        const dropdown = document.getElementById('dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }

    showProfileModal() {
        // Hide dropdown first
        const dropdown = document.getElementById('dropdown');
        if (dropdown) dropdown.classList.add('hidden');

        // Create profile modal
        const existingModal = document.getElementById('profileModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">My Profile</h3>
                    <button onclick="document.getElementById('profileModal').remove()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="text-center mb-4">
                    <img src="${this.currentUser?.profilePicture || `https://api.dicebear.com/7.x/avatars/svg?seed=${this.currentUser?.username}`}" alt="Profile Picture" class="w-20 h-20 rounded-full mx-auto mb-3">
                    <h4 class="text-xl font-semibold">${this.currentUser?.username || ''}</h4>
                    <p class="text-gray-600">${this.currentUser?.email || ''}</p>
                    <p class="text-sm text-gray-500 mt-2">Member since ${new Date(this.currentUser?.createdAt || '').toLocaleDateString()}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    viewProgress() {
        const dropdown = document.getElementById('dropdown');
        if (dropdown) dropdown.classList.add('hidden');
        
        this.showSuccess('Progress tracking feature coming soon!');
    }

    validateEmail() {
        const emailInput = document.getElementById('signup-email');
        const errorElement = document.getElementById('email-error');
        
        if (emailInput && errorElement) {
            const email = emailInput.value.trim();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            if (email && !isValid) {
                errorElement.style.display = 'block';
                emailInput.classList.add('border-red-500');
            } else {
                errorElement.style.display = 'none';
                emailInput.classList.remove('border-red-500');
            }
        }
    }

    validatePasswordRealTime() {
        const passwordInput = document.getElementById('signup-password');
        if (!passwordInput) return;

        const password = passwordInput.value;
        
        // Add visual feedback for password strength
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

        // Update password strength indicator
        const strengthIndicator = document.getElementById('password-strength');
        if (strengthIndicator) {
            const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
            const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
            
            strengthIndicator.className = `h-2 rounded transition-all duration-300 ${strengthColors[Math.min(strength, 4)] || 'bg-gray-300'}`;
            strengthIndicator.style.width = `${(strength / 5) * 100}%`;
            
            const strengthLabel = document.getElementById('password-strength-label');
            if (strengthLabel) {
                strengthLabel.textContent = password ? strengthLabels[Math.min(strength, 4)] || 'Very Weak' : '';
                strengthLabel.className = `text-xs mt-1 ${strength >= 3 ? 'text-green-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-600'}`;
            }
        }
    }

    validatePasswordMatch() {
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const errorElement = document.getElementById('password-match-error');
        
        if (passwordInput && confirmPasswordInput && errorElement) {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword && password !== confirmPassword) {
                errorElement.style.display = 'block';
                confirmPasswordInput.classList.add('border-red-500');
            } else {
                errorElement.style.display = 'none';
                confirmPasswordInput.classList.remove('border-red-500');
            }
        }
    }

    clearForm(formType) {
        if (formType === 'create-account') {
            const fields = ['signup-username', 'signup-email', 'signup-password', 'confirm-password'];
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = '';
                    field.classList.remove('border-red-500');
                }
            });
            
            // Clear error messages
            const errors = ['email-error', 'password-match-error'];
            errors.forEach(errorId => {
                const error = document.getElementById(errorId);
                if (error) error.style.display = 'none';
            });

            // Reset password strength indicator
            const strengthIndicator = document.getElementById('password-strength');
            const strengthLabel = document.getElementById('password-strength-label');
            if (strengthIndicator) {
                strengthIndicator.style.width = '0%';
                strengthIndicator.className = 'h-2 rounded transition-all duration-300 bg-gray-300';
            }
            if (strengthLabel) {
                strengthLabel.textContent = '';
            }
        } else if (formType === 'sign-in') {
            const fields = ['signin-username-email', 'signin-password'];
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = '';
                    field.classList.remove('border-red-500');
                }
            });
        }
    }

    showError(message) {
        this.hideAllNotifications();
        const notification = this.createNotification('error', message);
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    showSuccess(message) {
        this.hideAllNotifications();
        const notification = this.createNotification('success', message);
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    showPasswordErrors(errors) {
        const errorMessage = `Password requirements not met:\n${errors.join('\n')}`;
        this.showError(errorMessage);
    }

    showLoading(message) {
        this.hideLoading();
        const loader = document.createElement('div');
        loader.id = 'auth-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        loader.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span class="text-gray-700">${message}</span>
            </div>
        `;
        
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.getElementById('auth-loader');
        if (loader) loader.remove();
    }

    createNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        const icons = {
            success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>`,
            error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                   </svg>`,
            info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>`
        };
        
        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    ${icons[type]}
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium whitespace-pre-line">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-white opacity-70 hover:opacity-100">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
        
        return notification;
    }

    hideAllNotifications() {
        const notifications = document.querySelectorAll('.fixed.top-4.right-4');
        notifications.forEach(notification => notification.remove());
    }

    // API helper methods
    async makeAuthenticatedRequest(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, mergedOptions);
            
            if (response.status === 401) {
                this.clearAuth();
                this.updateUIForLoggedOutUser();
                this.showError('Session expired. Please sign in again.');
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token && !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAuthToken() {
        return this.token;
    }
}

// Initialize the authentication system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.learnPathAuth = new LearnPathAuth();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearnPathAuth;
}
