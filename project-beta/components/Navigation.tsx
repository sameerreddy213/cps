import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AuthState } from '../types';

interface NavigationProps {
  authState: AuthState;
  onAuthClick: (type: 'login' | 'signup') => void;
  onLogout: () => void;
}

const Navigation: React.FC<{
  authState: AuthState;
  onAuthClick: (type: 'login' | 'signup') => void;
  onLogout: () => void;
}> = ({ authState, onAuthClick, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">YourLogo</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#help" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Help</a>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {authState.user?.name}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onAuthClick('login')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Try Free
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <a href="#home" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">About</a>
              <a href="#features" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Features</a>
              <a href="#help" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Help</a>
              {!authState.isAuthenticated && (
                <>
                  <button
                    onClick={() => onAuthClick('login')}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onAuthClick('signup')}
                    className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Try Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navigation;