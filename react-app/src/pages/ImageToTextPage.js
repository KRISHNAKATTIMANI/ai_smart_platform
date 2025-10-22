import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRecentSearches } from '../context/RecentSearchesContext';
import { useAuth } from '../context/AuthContext';
import InsightCard from '../components/InsightCard';
import FeatureHistory from '../components/FeatureHistory';
import axios from 'axios';
import { trackFeatureUsage } from '../utils/analytics';

const ImageToTextPage = () => {
  const navigate = useNavigate();
  const { addRecentSearch, getRecentSearches } = useRecentSearches();
  const { currentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [timestamp, setTimestamp] = useState(null);

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
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fullText } = uploadResponse.data;
      setExtractedText(fullText);

      const analyzeResponse = await axios.post('/api/analyze', {
        content: fullText,
        prompt: customPrompt || null,
      });

      const { result } = analyzeResponse.data;
      setAiAnalysis(result);
      setTimestamp(Date.now());

      addRecentSearch('ImageToText', {
        fileName: selectedFile.name,
        extractedText: fullText.substring(0, 100) + '...',
        prompt: customPrompt || 'Auto Analysis',
      });

      // Track feature usage with complete data
      trackFeatureUsage(
        'image-to-text',
        'analyze',
        {
          fileName: selectedFile.name,
          hasCustomPrompt: !!customPrompt,
          customPrompt: customPrompt || null,
          extractedText: fullText,
          result: result
        },
        currentUser?.uid
      );

      loadRecentSearches();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <PhotoIcon className="w-10 h-10 text-purple-600" />
            Image → Text Extraction
          </h1>
          <p className="text-lg text-gray-600">
            Extract text from images and get intelligent AI analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Insights/Results (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {extractedText && (
              <div className="animate-slideInLeft">
                <InsightCard
                  title="Extracted Text"
                  content={extractedText}
                  type="extracted"
                  timestamp={timestamp}
                />
              </div>
            )}

            {aiAnalysis && (
              <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                <InsightCard
                  title="AI Analysis"
                  content={aiAnalysis}
                  type="ai"
                  timestamp={timestamp}
                />
              </div>
            )}

            {!extractedText && !aiAnalysis && !loading && (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your extracted text and AI analysis will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Upload an image and click Process to get started</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl border-2 border-purple-200 p-12 text-center animate-pulse-subtle">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">AI is processing your image...</p>
                <p className="text-gray-400 text-sm mt-2">Extracting text and generating analysis</p>
              </div>
            )}

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                💡 Tips for Better Results
              </h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span><strong>Clear images:</strong> Use high-resolution, well-lit photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span><strong>Supported formats:</strong> PNG, JPG, GIF up to 16MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span><strong>Custom prompts:</strong> Guide the AI with specific instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span><strong>Download results:</strong> Save your insights as PDF for later reference</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Input & Controls (1 column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Upload Image</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-all duration-200 cursor-pointer bg-gradient-to-br from-gray-50 to-purple-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 font-medium">
                    Click to upload
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
                    className="w-full h-auto rounded-lg shadow-md"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                  <p className="text-sm text-gray-600 mt-2 text-center truncate">
                    {selectedFile?.name}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Prompt (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g., 'Describe this image' or 'Extract all text'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none text-sm"
                  rows="3"
                />
              </div>

              <button
                onClick={handleProcess}
                disabled={!selectedFile || loading}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
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

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Recent Searches</h3>
              {recentSearches.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-400">No recent searches</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentSearches.map((search) => (
                    <div
                      key={search.id}
                      className="p-3 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <p className="text-gray-700 text-sm font-medium truncate">{search.fileName}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {new Date(search.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature History */}
        {currentUser && (
          <div className="mt-8">
            <FeatureHistory
              featureType="image-to-text"
              featureName="Image to Text"
              featureColor="green"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToTextPage;
