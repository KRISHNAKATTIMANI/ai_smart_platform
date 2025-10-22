import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../config/api';

const OutpaintingPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [outpaintedImage, setOutpaintedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('all');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      setSelectedImage(file);
      setError('');
      setOutpaintedImage('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateOutpaint = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    if (!prompt.trim()) {
      setError('Please describe what you want to expand the image with');
      return;
    }

    setLoading(true);
    setError('');
    setOutpaintedImage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('prompt', prompt);
      formData.append('direction', direction);

      const response = await fetch(`${API_BASE_URL}/api/outpaint`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOutpaintedImage(data.image_url);
      } else {
        setError(data.error || 'Failed to generate outpainted image');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!outpaintedImage) return;

    try {
      const response = await fetch(outpaintedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `outpainted-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image');
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
            <PhotoIcon className="w-10 h-10 text-primary" />
            <span>Outpainting & Background Fill</span>
            <SparklesIcon className="w-10 h-10 text-primary" />
          </h1>
          <p className="text-gray-600">
            Expand and complete images intelligently using AI. Upload a cropped or partial image and let AI fill in the missing parts.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg mb-4"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <PhotoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload an image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expansion Prompt</h3>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to add around the image... (e.g., 'complete the elephant body and add a natural savanna background')"
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expansion Direction
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Directions</option>
                  <option value="horizontal">Horizontal Only</option>
                  <option value="vertical">Vertical Only</option>
                  <option value="top">Top Only</option>
                  <option value="bottom">Bottom Only</option>
                  <option value="left">Left Only</option>
                  <option value="right">Right Only</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateOutpaint}
              disabled={loading || !selectedImage || !prompt.trim()}
              className="w-full px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                  <span>Generate Outpaint</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Result</h3>
              {outpaintedImage && (
                <button
                  onClick={downloadImage}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Download</span>
                </button>
              )}
            </div>

            <div className="border-2 border-gray-200 rounded-lg min-h-[600px] flex items-center justify-center bg-gray-50">
              {loading ? (
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600">AI is expanding your image...</p>
                </div>
              ) : outpaintedImage ? (
                <img
                  src={outpaintedImage}
                  alt="Outpainted result"
                  className="max-w-full max-h-[600px] rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <PhotoIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>Your outpainted image will appear here</p>
                  <p className="text-sm mt-2">Upload an image and click Generate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-7xl mx-auto">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips for Best Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <ul className="space-y-2">
              <li>• Use images with clear subjects (animals, objects, people)</li>
              <li>• Describe the context you want (background, setting)</li>
              <li>• Works best with partially cropped images</li>
              <li>• Be specific about what's missing in the image</li>
            </ul>
            <ul className="space-y-2">
              <li>• Example: "Complete elephant with full body and savanna"</li>
              <li>• Example: "Expand portrait with office background"</li>
              <li>• Higher quality input = better results</li>
              <li>• Try different expansion directions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutpaintingPage;
