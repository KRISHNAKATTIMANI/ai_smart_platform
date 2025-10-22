import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon, DocumentTextIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRecentSearches } from '../context/RecentSearchesContext';
import { useAuth } from '../context/AuthContext';
import InsightCard from '../components/InsightCard';
import FeatureHistory from '../components/FeatureHistory';
import axios from 'axios';
import { trackFeatureUsage } from '../utils/analytics';

const TextToTextPage = () => {
  const navigate = useNavigate();
  const { addRecentSearch, getRecentSearches } = useRecentSearches();
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [timestamp, setTimestamp] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summarizeMode, setSummarizeMode] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    const searches = getRecentSearches('TextToText');
    setRecentSearches(searches);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (500MB = 500 * 1024 * 1024 bytes)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 500MB limit. Please select a smaller file.');
        return;
      }

      // Check if it's a PDF
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }

      setSelectedFile(file);
      setInputText(''); // Clear text input when file is selected
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExtractedText('');
  };

  const handleProcessPDF = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    setLoading(true);
    setOutputText('');
    setExtractedText('');

    try {
      // First, upload and extract text from PDF
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fullText } = uploadResponse.data;
      setExtractedText(fullText);

      // Then analyze or summarize
      let prompt = inputText.trim();
      if (summarizeMode && !prompt) {
        prompt = 'Please provide a comprehensive summary of this document, highlighting the key points, main ideas, and important details.';
      } else if (!prompt) {
        prompt = 'Please analyze this document and provide insights.';
      }

      const analyzeResponse = await axios.post('/api/chat', {
        message: `${prompt}\n\nDocument content:\n${fullText}`,
      });

      setOutputText(analyzeResponse.data.response);
      setTimestamp(Date.now());

      addRecentSearch('TextToText', {
        input: `PDF: ${selectedFile.name}${summarizeMode ? ' (Summary)' : ''}`,
        output: analyzeResponse.data.response.substring(0, 100) + '...',
      });

      // Track feature usage
      trackFeatureUsage(
        'text-to-text',
        summarizeMode ? 'pdf-summarize' : 'pdf-analyze',
        {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          summarize: summarizeMode,
          customPrompt: inputText || null,
          result: analyzeResponse.data.response
        },
        currentUser?.uid
      );

      loadRecentSearches();
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    // If file is selected, process PDF instead
    if (selectedFile) {
      handleProcessPDF();
      return;
    }

    if (!inputText.trim()) {
      alert('Please enter some text');
      return;
    }

    setLoading(true);
    setOutputText('');

    try {
      const response = await axios.post('/api/chat', {
        message: inputText,
      });

      setOutputText(response.data.response);
      setTimestamp(Date.now());

      addRecentSearch('TextToText', {
        input: inputText.substring(0, 100) + '...',
        output: response.data.response.substring(0, 100) + '...',
      });

      // Track feature usage with complete data
      trackFeatureUsage(
        'text-to-text',
        'chat',
        {
          text: inputText,
          result: response.data.response
        },
        currentUser?.uid
      );

      loadRecentSearches();
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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
            <SparklesIcon className="w-10 h-10 text-indigo-600" />
            Text → Text Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Get intelligent AI-powered responses to your questions and prompts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Insights/Results (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {outputText && (
              <div className="animate-slideInLeft">
                <InsightCard
                  title="AI Response"
                  content={outputText}
                  type="ai"
                  timestamp={timestamp}
                />
              </div>
            )}

            {!outputText && !loading && (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your AI response will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Enter your text and click Analyze to get started</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl border-2 border-indigo-200 p-12 text-center animate-pulse-subtle">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">AI is analyzing your text...</p>
                <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
              </div>
            )}

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                💡 Tips for Better Results
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Be specific:</strong> Clear, detailed questions get better answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Context matters:</strong> Provide background information when needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Use examples:</strong> Show what kind of output you expect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Break it down:</strong> Complex tasks work better in steps</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Input & Recent (1 column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Your Input</h3>

              {/* Tab Selection */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {setSelectedFile(null); setExtractedText('');}}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    !selectedFile
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Text Input
                </button>
                <button
                  onClick={() => document.getElementById('pdf-upload').click()}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    selectedFile
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                  PDF Upload
                </button>
              </div>

              {/* PDF Upload Section */}
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="border-2 border-indigo-200 bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <DocumentTextIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="ml-2 text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Summarize Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-700">Summarize PDF</span>
                    <button
                      onClick={() => setSummarizeMode(!summarizeMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        summarizeMode ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          summarizeMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Optional Custom Prompt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Question (Optional)
                    </label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={summarizeMode ? "Leave empty for automatic summary..." : "Ask a specific question about the PDF..."}
                      className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none text-sm"
                    />
                  </div>
                </div>
              ) : (
                /* Text Input Section */
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your question or text here..."
                  className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                />
              )}

              {/* Hidden File Input */}
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Process Button */}
              <button
                onClick={handleProcess}
                disabled={loading || (!inputText.trim() && !selectedFile)}
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>{selectedFile ? (summarizeMode ? 'Summarize PDF' : 'Analyze PDF') : 'Analyze'}</span>
                  </>
                )}
              </button>

              {/* File Size Info */}
              {!selectedFile && (
                <p className="mt-3 text-xs text-gray-500 text-center">
                  <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                  PDF files up to 500MB supported
                </p>
              )}
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
                      className="p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <p className="text-gray-700 text-sm truncate font-medium">{search.input}</p>
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
              featureType="text-to-text"
              featureName="Text to Text"
              featureColor="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToTextPage;
