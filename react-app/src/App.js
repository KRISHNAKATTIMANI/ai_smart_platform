import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TextToTextPage from './pages/TextToTextPage';
import TextToImagePage from './pages/TextToImagePage';
import ImageToTextPage from './pages/ImageToTextPage';
import VoiceToTextPage from './pages/VoiceToTextPage';
import TextToAudioPage from './pages/TextToAudioPage';
import OutpaintingPage from './pages/OutpaintingPage';
import ImageEnhancePage from './pages/ImageEnhancePage';
import Dashboard from './pages/Dashboard';
import { RecentSearchesProvider } from './context/RecentSearchesContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/home" /> : <LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/text-to-text"
        element={
          <ProtectedRoute>
            <TextToTextPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/text-to-image"
        element={
          <ProtectedRoute>
            <TextToImagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/image-to-text"
        element={
          <ProtectedRoute>
            <ImageToTextPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voice-to-text"
        element={
          <ProtectedRoute>
            <VoiceToTextPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/text-to-audio"
        element={
          <ProtectedRoute>
            <TextToAudioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/outpainting"
        element={
          <ProtectedRoute>
            <OutpaintingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/image-enhance"
        element={
          <ProtectedRoute>
            <ImageEnhancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RecentSearchesProvider>
          <Router>
            <AppRoutes />
          </Router>
        </RecentSearchesProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
