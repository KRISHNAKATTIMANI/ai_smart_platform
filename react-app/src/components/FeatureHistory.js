import React, { useState, useEffect } from 'react';
import { ClockIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const FeatureHistory = ({ featureType, featureName, featureColor = 'blue' }) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser, featureType]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history`, {
        params: {
          userId: currentUser?.uid,
          featureType: featureType,
          limit: 5
        }
      });

      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getPreviewText = (data) => {
    if (!data) return 'No preview available';

    // Extract meaningful preview based on feature type
    if (data.prompt) return data.prompt.substring(0, 60) + (data.prompt.length > 60 ? '...' : '');
    if (data.text) return data.text.substring(0, 60) + (data.text.length > 60 ? '...' : '');
    if (data.fileName) return `File: ${data.fileName}`;
    if (data.input) return data.input.substring(0, 60) + (data.input.length > 60 ? '...' : '');

    return 'View details';
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
    green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
    red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ClockIcon className="w-5 h-5 mr-2" />
          Recent {featureName} History
        </h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ClockIcon className="w-5 h-5 mr-2" />
          Recent {featureName} History
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No history yet. Start using this feature to see your recent activities!
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => openDetails(item)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  colorClasses[featureColor] || colorClasses.blue
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getPreviewText(item.data)}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 ml-2 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Search Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Timestamp */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date & Time
                </label>
                <p className="text-gray-900">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>

              {/* Action */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Action
                </label>
                <p className="text-gray-900 capitalize">{selectedItem.action}</p>
              </div>

              {/* Input/Prompt */}
              {selectedItem.data && (
                <>
                  {selectedItem.data.prompt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Your Prompt
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedItem.data.prompt}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedItem.data.text && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Input Text
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedItem.data.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedItem.data.fileName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        File Name
                      </label>
                      <p className="text-gray-900">{selectedItem.data.fileName}</p>
                    </div>
                  )}

                  {selectedItem.data.style && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Style
                      </label>
                      <p className="text-gray-900 capitalize">{selectedItem.data.style}</p>
                    </div>
                  )}

                  {selectedItem.data.size && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Size
                      </label>
                      <p className="text-gray-900">{selectedItem.data.size}</p>
                    </div>
                  )}

                  {selectedItem.data.result && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Result
                      </label>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedItem.data.result}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedItem.data.extractedText && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Extracted Text
                      </label>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 max-h-60 overflow-y-auto">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedItem.data.extractedText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Display any other data fields */}
                  {Object.keys(selectedItem.data).map((key) => {
                    if (!['prompt', 'text', 'fileName', 'style', 'size', 'result', 'extractedText'].includes(key)) {
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="text-gray-900">
                            {typeof selectedItem.data[key] === 'object'
                              ? JSON.stringify(selectedItem.data[key], null, 2)
                              : String(selectedItem.data[key])}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={closeModal}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureHistory;
