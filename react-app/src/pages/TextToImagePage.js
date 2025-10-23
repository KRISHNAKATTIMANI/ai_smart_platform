import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { trackFeatureUsage } from '../utils/analytics';
import FeatureHistory from '../components/FeatureHistory';

const TextToImagePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError(t('no_input') || 'Please enter a description for the image');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');
    setEnhancedPrompt('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-image`, {
        prompt: prompt.trim(),
        style,
        size
      });

      if (response.data.success) {
        setGeneratedImage(response.data.image_url);
        setEnhancedPrompt(response.data.enhanced_prompt);

        // Track feature usage with complete data
        trackFeatureUsage(
          'text-to-image',
          'generate',
          {
            prompt: prompt.trim(),
            style,
            size,
            imageUrl: response.data.image_url,
            enhancedPrompt: response.data.enhanced_prompt
          },
          currentUser?.uid
        );
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('back_to_home')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('text_to_image')}</h1>
          <p className="text-gray-600">Generate stunning images from text descriptions using AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('enter_text')}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />

              {/* Style Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['realistic', 'artistic', 'anime', 'cartoon', '3d'].map((styleOption) => (
                    <button
                      key={styleOption}
                      onClick={() => setStyle(styleOption)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                        style === styleOption
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="512x512">512 × 512 (Small, Square)</option>
                  <option value="1024x1024">1024 × 1024 (Large, Square)</option>
                  <option value="1024x768">1024 × 768 (Landscape)</option>
                  <option value="768x1024">768 × 1024 (Portrait)</option>
                  <option value="1920x1080">1920 × 1080 (HD Landscape)</option>
                </select>
              </div>

              <button
                onClick={generateImage}
                disabled={loading || !prompt.trim()}
                className="mt-4 w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t('processing')}</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>{t('generate')}</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {enhancedPrompt && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-1">Enhanced Prompt:</p>
                  <p className="text-sm text-blue-800">{enhancedPrompt}</p>
                </div>
              )}
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Examples:</h3>
              <div className="space-y-2">
                {[
                  'Sunset over ocean with palm trees',
                  'Futuristic city skyline at night',
                  'Mountain landscape with snow peaks',
                  'Cute puppy playing in garden'
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded border border-gray-200 hover:border-primary transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">{t('tips_title')}</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('tip_be_specific')}</li>
                <li>• Try different styles for various artistic effects</li>
                <li>• Add details like "at sunset" or "professional photo"</li>
                <li>• Experiment with image sizes for different uses</li>
              </ul>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Generated Image</h3>
              {generatedImage && (
                <button
                  onClick={downloadImage}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>{t('download_pdf') || 'Download'}</span>
                </button>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[500px] flex items-center justify-center bg-gray-50">
              {loading ? (
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-500">Generating your image...</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-auto rounded-lg"
                  onError={() => setError('Failed to load generated image')}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Your generated image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature History */}
        {currentUser && (
          <div className="mt-8">
            <FeatureHistory
              featureType="text-to-image"
              featureName="Text to Image"
              featureColor="purple"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToImagePage;
