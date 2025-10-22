import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import InsightCard from '../components/InsightCard';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const VoiceToTextPage = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        if (final) {
          setTranscript((prev) => prev + final);
          setInterimTranscript('');
        } else {
          setInterimTranscript(interim);
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access denied.');
        } else if (event.error !== 'no-speech' && event.error !== 'network') {
          setError(`Error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            setIsRecording(false);
          }
        }
      };
    } else {
      setError('Speech recognition not supported.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore
        }
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (recognitionRef.current && !isRecording) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        recognitionRef.current.start();
      } catch (err) {
        setError('Microphone access denied.');
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setAiResponse('');
    setTimestamp(null);
  };

  const analyzeWithAI = async () => {
    if (!transcript.trim()) {
      setError('No transcript to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      });

      const data = await response.json();
      if (data.success) {
        setAiResponse(data.response);
        setTimestamp(Date.now());
      } else {
        setError(data.error || 'Failed to get AI response');
      }
    } catch (err) {
      setError('Failed to connect to AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-teal-50">
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
            <MicrophoneIcon className="w-10 h-10 text-green-600" />
            Voice → Text Transcription
          </h1>
          <p className="text-lg text-gray-600">
            Convert your speech to text in real-time with AI-powered analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {transcript && (
              <div className="animate-slideInLeft">
                <InsightCard
                  title="Transcription"
                  content={transcript}
                  type="extracted"
                  timestamp={timestamp}
                />
              </div>
            )}

            {aiResponse && (
              <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                <InsightCard
                  title="AI Response"
                  content={aiResponse}
                  type="ai"
                  timestamp={timestamp}
                />
              </div>
            )}

            {!transcript && !aiResponse && !isRecording && (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <MicrophoneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your transcription will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Click the microphone to start recording</p>
              </div>
            )}

            {isRecording && !transcript && (
              <div className="bg-white rounded-xl border-2 border-green-200 p-12 text-center animate-pulse-subtle">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 font-medium">Listening... Speak now!</p>
                <p className="text-gray-400 text-sm mt-2">Your words will appear above</p>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                💡 Tips for Better Transcription
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span><strong>Clear environment:</strong> Use a quiet space</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span><strong>Speak clearly:</strong> Moderate pace works best</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span><strong>Distance:</strong> Stay 6-12 inches from mic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span><strong>Browser:</strong> Works best in Chrome, Edge, Safari</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg text-center">Voice Recording</h3>
              
              <div className="flex flex-col items-center py-8">
                {isRecording ? (
                  <div className="relative">
                    <button
                      onClick={stopRecording}
                      className="w-28 h-28 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-xl"
                    >
                      <StopIcon className="w-14 h-14 text-white" />
                    </button>
                    {isListening && (
                      <>
                        <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-50"></div>
                        <div className="absolute inset-0 rounded-full animate-pulse bg-red-300 opacity-30"></div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={!!error && error.includes('not supported')}
                    className="w-28 h-28 bg-gradient-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
                  >
                    <MicrophoneIcon className="w-14 h-14 text-white" />
                  </button>
                )}
              </div>

              <p className="text-center text-gray-600 mt-6 font-medium">
                {isRecording ? (
                  <span className="flex items-center justify-center gap-2 text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording... Click to stop
                  </span>
                ) : (
                  'Click the microphone to start'
                )}
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {transcript && (
                <div className="mt-6 space-y-2">
                  <button
                    onClick={analyzeWithAI}
                    disabled={isAnalyzing}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                  >
                    {isAnalyzing ? 'Analyzing...' : '🤖 Ask AI'}
                  </button>
                  <button
                    onClick={clearTranscript}
                    className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Clear
                  </button>
                </div>
              )}

              {interimTranscript && (
                <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 italic">{interimTranscript}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceToTextPage;
