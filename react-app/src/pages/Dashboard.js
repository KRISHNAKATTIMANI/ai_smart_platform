import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRecentSearches } from '../context/RecentSearchesContext';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { getAllRecentSearches } = useRecentSearches();
  const [usageData, setUsageData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Try to fetch usage data from API
      try {
        const response = await axios.get('/api/usage');
        setUsageData(response.data);
      } catch (error) {
        // If API not available, use mock data
        setUsageData({
          textToText: 45,
          textToImage: 23,
          imageToText: 67,
          voiceToText: 12,
          textToAudio: 34,
        });
      }

      // Load recent searches from localStorage
      const searches = getAllRecentSearches();
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = usageData
    ? {
        labels: [
          'Text → Text',
          'Text → Image',
          'Image → Text',
          'Voice → Text',
          'Text → Audio',
        ],
        datasets: [
          {
            label: 'Usage Count',
            data: [
              usageData.textToText,
              usageData.textToImage,
              usageData.imageToText,
              usageData.voiceToText,
              usageData.textToAudio,
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(234, 179, 8, 0.8)',
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(168, 85, 247)',
              'rgb(34, 197, 94)',
              'rgb(239, 68, 68)',
              'rgb(234, 179, 8)',
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Feature Usage Statistics',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#111827',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const getFeatureLabel = (feature) => {
    const labels = {
      TextToText: 'Text → Text',
      TextToImage: 'Text → Image',
      ImageToText: 'Image → Text',
      VoiceToText: 'Voice → Text',
      TextToAudio: 'Text → Audio',
    };
    return labels[feature] || feature;
  };

  const getFeaturePath = (feature) => {
    const paths = {
      TextToText: '/text-to-text',
      TextToImage: '/text-to-image',
      ImageToText: '/image-to-text',
      VoiceToText: '/voice-to-text',
      TextToAudio: '/text-to-audio',
    };
    return paths[feature] || '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {usageData && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm font-medium text-gray-600">Text → Text</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {usageData.textToText}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm font-medium text-gray-600">Text → Image</div>
                <div className="text-3xl font-bold text-purple-600 mt-2">
                  {usageData.textToImage}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm font-medium text-gray-600">Image → Text</div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {usageData.imageToText}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm font-medium text-gray-600">Voice → Text</div>
                <div className="text-3xl font-bold text-red-600 mt-2">
                  {usageData.voiceToText}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm font-medium text-gray-600">Text → Audio</div>
                <div className="text-3xl font-bold text-yellow-600 mt-2">
                  {usageData.textToAudio}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>

        {/* Recent Searches Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity (Last 10 Searches)
          </h2>
          
          {recentSearches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No recent activity to display
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSearches.map((search) => (
                    <tr key={search.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary text-white">
                          {getFeatureLabel(search.feature)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {search.fileName || search.input || search.text || 'N/A'}
                        </div>
                        {search.prompt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {search.prompt}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(search.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(getFeaturePath(search.feature))}
                          className="text-primary hover:text-indigo-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
