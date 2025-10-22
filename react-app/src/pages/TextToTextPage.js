import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRecentSearches } from '../context/RecentSearchesContext';
import axios from 'axios';

const TextToTextPage = () => {
  const navigate = useNavigate();
  const { addRecentSearch, getRecentSearches } = useRecentSearches();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Text → Text Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <button
                onClick={handleProcess}
                disabled={loading}
                className="mt-4 w-full bg-primary text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>

            {outputText && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold mb-4">AI Response</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{outputText}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Recent Searches</h3>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-gray-500">No recent searches</p>
              ) : (
                <div className="space-y-3">
                  {recentSearches.map((search) => (
                    <div key={search.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="text-gray-600 truncate">{search.input}</p>
                      <p className="text-xs text-gray-500 mt-1">
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
