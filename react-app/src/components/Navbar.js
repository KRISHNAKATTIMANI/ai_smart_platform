import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { t } = useLanguage();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-800">AI Platform</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium">{t('dashboard') || 'Dashboard'}</span>
            </Link>
            
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
