import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRecentSearches } from '../context/RecentSearchesContext';
import InsightCard from '../components/InsightCard';
import axios from 'axios';

const TextToTextPage = () => {
  const navigate = useNavigate();
  const { addRecentSearch, getRecentSearches } = useRecentSearches();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    const searches = getRecentSearches('TextToText');
    setRecentSearches(searches);
  };

  const handleProcess = async () => {
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
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your question or text here..."
                className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
              />
              
              <button
                onClick={handleProcess}
                disabled={loading || !inputText.trim()}
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
                    <span>Analyze</span>
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
      </div>
    </div>
  );
};

export default TextToTextPage;
