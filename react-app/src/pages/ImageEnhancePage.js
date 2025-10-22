import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowUpTrayIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const ImageEnhancePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [enhancedImage, setEnhancedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scale, setScale] = useState('2');
  const [faceEnhance, setFaceEnhance] = useState(false);
  const [method, setMethod] = useState('local'); // 'local' or 'replicate'

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setEnhancedImage('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpscale = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setEnhancedImage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('scale', scale);
      formData.append('face_enhance', faceEnhance ? 'true' : 'false');
      formData.append('method', method);

      const response = await axios.post(`${API_BASE_URL}/api/upscale`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setEnhancedImage(response.data.image_url);
      } else {
        setError('Failed to enhance image. Please try again.');
      }
    } catch (err) {
      console.error('Enhancement error:', err);

      // Handle rate limit errors
      if (err.response?.status === 429) {
        setError(
          err.response?.data?.message ||
          'Rate limit exceeded. Please wait a minute and try again.'
        );
      }
      // Handle billing/credit errors
      else if (err.response?.status === 402) {
        setError(
          err.response?.data?.message ||
          'Insufficient credits. Please add a payment method to your Replicate account.'
        );
      }
      // Handle other errors
      else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to enhance image. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Image Upscaling & Enhancement
          </h1>
          <p className="text-gray-600">
            Enhance image quality and increase resolution using AI-powered Real-ESRGAN
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload & Settings */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upload Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </label>
              </div>

              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Enhancement Settings</h3>
              
              <div className="space-y-4">
                {/* Enhancement Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enhancement Method
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMethod('local')}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                        method === 'local'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            🆓 FREE Local Processing
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            OpenCV + PIL • No limits • Instant
                          </div>
                        </div>
                        {method === 'local' && (
                          <span className="text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setMethod('replicate')}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                        method === 'replicate'
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            🤖 AI-Powered (Replicate)
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Real-ESRGAN • Best quality • Requires API key
                          </div>
                        </div>
                        {method === 'replicate' && (
                          <span className="text-primary">✓</span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upscale Factor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setScale('2')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        scale === '2'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      2x
                    </button>
                    <button
                      onClick={() => setScale('4')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        scale === '4'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      4x
                    </button>
                  </div>
                </div>

                {method === 'replicate' && (
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={faceEnhance}
                        onChange={(e) => setFaceEnhance(e.target.checked)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Face Enhancement (GFPGAN)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 ml-6 mt-1">
                      Best for portraits and faces
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpscale}
                disabled={!selectedFile || loading}
                className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Enhance Image</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Info */}
            {method === 'local' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">🆓 FREE Local Enhancement:</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>100% Free:</strong> No API keys or payment needed</li>
                  <li>• <strong>Unlimited:</strong> No rate limits or quotas</li>
                  <li>• <strong>Instant:</strong> Processes on your computer</li>
                  <li>• <strong>Private:</strong> Your images stay local</li>
                  <li>• <strong>Quality:</strong> Uses OpenCV's advanced algorithms</li>
                  <li>• <strong>Features:</strong> Denoising, sharpening, contrast enhancement</li>
                </ul>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🤖 AI-Powered Enhancement:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Best Quality:</strong> State-of-the-art AI models</li>
                  <li>• <strong>Face Enhance:</strong> Specialized facial detail improvement</li>
                  <li>• <strong>Real-ESRGAN:</strong> Professional-grade upscaling</li>
                  <li>• <strong>Rate Limits:</strong> 6 requests/min on free tier</li>
                  <li>• <strong>Requires:</strong> Replicate API key with billing</li>
                </ul>
              </div>
            )}

            {/* Comparison */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Method Comparison:</h3>
              <div className="text-xs text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span><strong>Local:</strong></span>
                  <span className="text-green-600">Free, Fast, Unlimited ✅</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Replicate:</strong></span>
                  <span className="text-blue-600">Best Quality, Paid 💎</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-gray-600">
                    💡 <strong>Tip:</strong> Try FREE local method first! It works great for most images.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview - Original */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Original Image</h3>
              {preview && (
                <span className="text-sm text-gray-500">
                  {selectedFile && `${(selectedFile.size / 1024).toFixed(1)} KB`}
                </span>
              )}
            </div>

            <div className="border-2 border-gray-200 rounded-lg min-h-[400px] flex items-center justify-center bg-gray-50 overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Original"
                  className="max-w-full max-h-[400px] object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ArrowUpTrayIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Upload an image to preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview - Enhanced */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Enhanced Image</h3>
              {enhancedImage && (
                <button
                  onClick={() => downloadImage(enhancedImage, `enhanced-${scale}x-${Date.now()}.png`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>

            <div className="border-2 border-gray-200 rounded-lg min-h-[400px] flex items-center justify-center bg-gray-50 overflow-hidden">
              {loading ? (
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-500">AI is enhancing your image...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take 10-30 seconds</p>
                </div>
              ) : enhancedImage ? (
                <>
                  <img
                    src={enhancedImage}
                    alt="Enhanced"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                  <div className="absolute top-20 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {scale}x Enhanced
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Enhanced image will appear here</p>
                </div>
              )}
            </div>

            {enhancedImage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Image successfully enhanced at {scale}x resolution!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancePage;
