import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TextToTextPage from './pages/TextToTextPage';
import TextToImagePage from './pages/TextToImagePage';
import ImageToTextPage from './pages/ImageToTextPage';
import VoiceToTextPage from './pages/VoiceToTextPage';
import TextToAudioPage from './pages/TextToAudioPage';
import Dashboard from './pages/Dashboard';
import { RecentSearchesProvider } from './context/RecentSearchesContext';

function App() {
  return (
    <RecentSearchesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/text-to-text" element={<TextToTextPage />} />
          <Route path="/text-to-image" element={<TextToImagePage />} />
          <Route path="/image-to-text" element={<ImageToTextPage />} />
          <Route path="/voice-to-text" element={<VoiceToTextPage />} />
          <Route path="/text-to-audio" element={<TextToAudioPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </RecentSearchesProvider>
  );
}

export default App;
