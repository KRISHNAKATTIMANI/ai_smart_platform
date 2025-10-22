import React, { createContext, useContext, useCallback } from 'react';

const RecentSearchesContext = createContext();

export const useRecentSearches = () => {
  const context = useContext(RecentSearchesContext);
  if (!context) {
    throw new Error('useRecentSearches must be used within a RecentSearchesProvider');
  }
  return context;
};

export const RecentSearchesProvider = ({ children }) => {
  const addRecentSearch = useCallback((feature, searchData) => {
    const storageKey = `recent${feature}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...searchData
    };
    
    const updated = [newEntry, ...existing].slice(0, 5);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    return updated;
  }, []);

  const getRecentSearches = useCallback((feature) => {
    const storageKey = `recent${feature}`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }, []);

  const getAllRecentSearches = useCallback(() => {
    const features = [
      'TextToText',
      'TextToImage',
      'ImageToText',
      'VoiceToText',
      'TextToAudio'
    ];
    
    const allSearches = [];
    features.forEach(feature => {
      const searches = JSON.parse(localStorage.getItem(`recent${feature}`) || '[]');
      searches.forEach(search => {
        allSearches.push({
          ...search,
          feature
        });
      });
    });
    
    return allSearches
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, []);

  const value = {
    addRecentSearch,
    getRecentSearches,
    getAllRecentSearches
  };

  return (
    <RecentSearchesContext.Provider value={value}>
      {children}
    </RecentSearchesContext.Provider>
  );
};
