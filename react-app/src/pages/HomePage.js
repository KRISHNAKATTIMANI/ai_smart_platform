import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  PhotoIcon,
  CameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SparklesIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      id: 'text-to-text',
      title: t('text_to_text'),
      description: t('text_to_text_desc'),
      icon: DocumentTextIcon,
      path: '/text-to-text',
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      id: 'text-to-image',
      title: t('text_to_image'),
      description: t('text_to_image_desc'),
      icon: PhotoIcon,
      path: '/text-to-image',
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      id: 'image-to-text',
      title: t('image_to_text'),
      description: t('image_to_text_desc'),
      icon: CameraIcon,
      path: '/image-to-text',
      color: 'bg-green-500',
      status: 'active'
    },
    {
      id: 'outpainting',
      title: t('outpainting'),
      description: t('outpainting_desc'),
      icon: SparklesIcon,
      path: '/outpainting',
      color: 'bg-pink-500',
      status: 'active'
    },
    {
      id: 'image-enhance',
      title: t('image_enhance'),
      description: t('image_enhance_desc'),
      icon: ArrowsPointingOutIcon,
      path: '/image-enhance',
      color: 'bg-orange-500',
      status: 'active'
    },
    {
      id: 'voice-to-text',
      title: t('voice_to_text'),
      description: t('voice_to_text_desc'),
      icon: MicrophoneIcon,
      path: '/voice-to-text',
      color: 'bg-red-500',
      status: 'active'
    },
    {
      id: 'text-to-audio',
      title: t('text_to_audio'),
      description: t('text_to_audio_desc'),
      icon: SpeakerWaveIcon,
      path: '/text-to-audio',
      color: 'bg-yellow-500',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('welcome')} to AI Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('homepage_title')}
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
                      ✓ {t('success') || 'Active'}
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
