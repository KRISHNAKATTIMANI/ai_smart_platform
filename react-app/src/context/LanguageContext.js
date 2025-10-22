import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [uiStrings, setUiStrings] = useState({});
  const [loading, setLoading] = useState(true);

  // Load UI strings for current language
  const loadUIStrings = async (lang) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ui-strings?lang=${lang}`);
      if (response.data.success) {
        setUiStrings(response.data.strings);
      }
    } catch (error) {
      console.error('Error loading UI strings:', error);
      // Fallback to English
      if (lang !== 'en') {
        loadUIStrings('en');
      }
    } finally {
      setLoading(false);
    }
  };

  // Detect language from text
  const detectLanguage = async (text) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/detect-language`, { text });
      if (response.data.success) {
        return response.data.language;
      }
    } catch (error) {
      console.error('Error detecting language:', error);
    }
    return 'en';
  };

  // Change language
  const changeLanguage = (lang) => {
    if (lang !== currentLanguage) {
      setCurrentLanguage(lang);
      localStorage.setItem('preferred_language', lang);
      loadUIStrings(lang);
    }
  };

  // Auto-detect and switch language based on input
  const autoDetectAndSwitch = async (text) => {
    const detected = await detectLanguage(text);
    if (detected !== currentLanguage) {
      changeLanguage(detected);
    }
    return detected;
  };

  // Get localized string
  const t = (key) => {
    return uiStrings[key] || key;
  };

  // Initialize
  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferred_language') || 'en';
    setCurrentLanguage(savedLang);
    loadUIStrings(savedLang);
  }, []);

  const value = {
    currentLanguage,
    setLanguage: changeLanguage,
    detectLanguage,
    autoDetectAndSwitch,
    t,  // translate function
    uiStrings,
    loading,
    isKannada: currentLanguage === 'kn',
    isEnglish: currentLanguage === 'en',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
