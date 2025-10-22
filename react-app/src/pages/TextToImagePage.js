import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const TextToImagePage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      // Use the user's exact prompt without modification
      const encodedPrompt = encodeURIComponent(prompt);
      
      // Using Pollinations AI with high quality settings but respecting user's exact prompt
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1792&height=1024&seed=${Date.now()}&model=flux&nologo=true`;
      
      // Preload image to ensure it's ready
      const img = new Image();
      img.onload = () => {
        setGeneratedImage(imageUrl);
        setLoading(false);
      };
      img.onerror = () => {
        setError('Failed to generate image. Please try again with a different prompt.');
        setLoading(false);
      };
      img.src = imageUrl;
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
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
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Text → Image</h1>
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
                placeholder="Describe exactly what you want to see. Be specific! For example: 'Red BMW M3 parked in front of modern glass building at sunset' or just 'BMW' for a simple BMW image"
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              
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
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Example Prompts:</h3>
              <div className="space-y-2">
                {[
                  'BMW',
                  'Red Ferrari sports car',
                  'Sunset over mountains with clouds',
                  'Cat wearing sunglasses, professional photo'
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

            {/* Quality Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Writing Better Prompts:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-7">
                <li>• <strong>Simple:</strong> "BMW" gives you a BMW car</li>
                <li>• <strong>Detailed:</strong> "Red BMW M5 on mountain road" is more specific</li>
                <li>• <strong>Very Detailed:</strong> Add lighting, style, quality words for best results</li>
                <li>• <strong>Tip:</strong> More details = more accurate image!</li>
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
                  <span>Download</span>
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
      </div>
    </div>
  );
};

export default TextToImagePage;
