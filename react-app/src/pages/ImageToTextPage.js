import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRecentSearches } from '../context/RecentSearchesContext';
import axios from 'axios';

const ImageToTextPage = () => {
  const navigate = useNavigate();
  const { addRecentSearch, getRecentSearches } = useRecentSearches();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    const searches = getRecentSearches('ImageToText');
    setRecentSearches(searches);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setLoading(true);
    setExtractedText('');
    setAiAnalysis('');

    try {
      // Upload file and extract text
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fullText } = uploadResponse.data;
      setExtractedText(fullText);

      // Analyze with AI
      const analyzeResponse = await axios.post('/api/analyze', {
        content: fullText,
        prompt: customPrompt || null,
      });

      const { result } = analyzeResponse.data;
      setAiAnalysis(result);

      // Add to recent searches
      addRecentSearch('ImageToText', {
        fileName: selectedFile.name,
        extractedText: fullText.substring(0, 100) + '...',
        prompt: customPrompt || 'Auto Analysis',
      });

      loadRecentSearches();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = (search) => {
    setExtractedText(search.extractedText);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Image → Text</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 16MB
                    </span>
                  </label>
                </div>

                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                      style={{ maxHeight: '300px' }}
                    />
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {selectedFile?.name}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Analysis Prompt (Optional)
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="E.g., 'Describe this image in detail' or 'Extract all text from this document'"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                  />
                </div>

                <button
                  onClick={handleProcess}
                  disabled={!selectedFile || loading}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Process Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Section */}
            {(extractedText || aiAnalysis) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
                
                {extractedText && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Extracted Content
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{extractedText}</p>
                    </div>
                  </div>
                )}

                {aiAnalysis && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      AI Analysis
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {aiAnalysis}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Recent Searches */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Searches
              </h2>
              
              {recentSearches.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent searches yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentSearches.map((search) => (
                    <div
                      key={search.id}
                      onClick={() => handleRecentSearchClick(search)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {search.fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {search.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToTextPage;
