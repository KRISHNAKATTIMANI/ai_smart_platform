import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChartBarIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-800">AI Platform</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Email */}
            {currentUser && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCircleIcon className="w-5 h-5" />
                <span className="hidden md:inline">{currentUser.email}</span>
              </div>
            )}

            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium hidden md:inline">{t('dashboard') || 'Dashboard'}</span>
            </Link>

            <LanguageSelector />

            {/* Logout Button */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium hidden md:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
