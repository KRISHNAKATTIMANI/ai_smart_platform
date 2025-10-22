import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  PhotoIcon,
  CameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'text-to-text',
      title: 'Text → Text',
      description: 'AI-powered text analysis and generation',
      icon: DocumentTextIcon,
      path: '/text-to-text',
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      id: 'text-to-image',
      title: 'Text → Image',
      description: 'Generate images from text descriptions',
      icon: PhotoIcon,
      path: '/text-to-image',
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      id: 'image-to-text',
      title: 'Image → Text',
      description: 'Extract text and analyze images',
      icon: CameraIcon,
      path: '/image-to-text',
      color: 'bg-green-500',
      status: 'active'
    },
    {
      id: 'voice-to-text',
      title: 'Voice → Text',
      description: 'Convert speech to text',
      icon: MicrophoneIcon,
      path: '/voice-to-text',
      color: 'bg-red-500',
      status: 'active'
    },
    {
      id: 'text-to-audio',
      title: 'Text → Audio',
      description: 'Convert text to natural speech',
      icon: SpeakerWaveIcon,
      path: '/text-to-audio',
      color: 'bg-yellow-500',
      status: 'active'
    }
  ];

  const objectives = [
    { title: 'Image-to-Text Summarization', desc: 'Extract instant insights from visuals', status: 'completed' },
    { title: 'Text-to-Image Generation', desc: 'Transform ideas into high-quality visuals', status: 'completed' },
    { title: 'AI Upscaling & Editing', desc: 'Enhance image quality and automate modifications', status: 'coming-soon' },
    { title: 'Outpainting & Background Fill', desc: 'Expand and clean up images intelligently', status: 'coming-soon' },
    { title: 'AI-Enhanced App Development', desc: 'Integrate voice, vision, and NLP features', status: 'completed' },
    { title: 'Real-Time Intelligence', desc: 'Provide instant predictions and personalization', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful AI tools for text, image, voice, and audio processing.
            Choose a feature below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 border-2 border-transparent hover:border-primary relative"
              >
                {feature.status === 'active' && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </div>
                )}
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Objectives Section */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Objectives</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objectives.map((obj, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {obj.status === 'completed' ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{obj.title}</h3>
                      {obj.status === 'coming-soon' && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Coming Soon</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{obj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <span className="text-sm">Powered by Gemini AI</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
