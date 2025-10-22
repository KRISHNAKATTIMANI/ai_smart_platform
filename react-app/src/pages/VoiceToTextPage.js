import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MicrophoneIcon, StopIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const VoiceToTextPage = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        console.log('Got speech result:', event.results);
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          console.log('Transcript part:', transcriptPart, 'isFinal:', event.results[i].isFinal);
          
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
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setError('Microphone access denied. Please allow microphone access in your browser settings and reload the page.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try again and speak clearly.');
          // Don't stop recording on no-speech, just show warning
          setTimeout(() => setError(''), 3000);
        } else if (event.error === 'network') {
          // Network error often occurs even with good connection - ignore it
          console.log('Network error ignored - continuing with local recognition');
          setError('');
        } else if (event.error === 'aborted') {
          setError('');
        } else {
          setError(`Error: ${event.error}. Please try clicking the microphone again.`);
        }
        
        if (event.error !== 'no-speech' && event.error !== 'network') {
          setIsRecording(false);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        // Auto-restart if we're still supposed to be recording
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.log('Could not restart:', err);
            setIsRecording(false);
          }
        }
      };
    } else {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log('Cleanup error:', err);
        }
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (recognitionRef.current && !isRecording) {
      setError('');
      
      // First, request microphone permission explicitly
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.error('Microphone permission error:', err);
        setError('Microphone access denied. Please allow microphone access and reload the page.');
        return;
      }

      setIsRecording(true);
      setIsListening(true);
      
      try {
        recognitionRef.current.start();
        console.log('Recognition started successfully');
      } catch (err) {
        console.error('Failed to start recording:', err);
        if (err.message && err.message.includes('already started')) {
          // Already running, that's okay
          console.log('Recognition already running');
        } else {
          setError('Failed to start recording. Please refresh the page and try again.');
          setIsRecording(false);
          setIsListening(false);
        }
      }
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setError('');
      alert('Microphone access granted! You can now start recording.');
    } catch (err) {
      console.error('Microphone permission error:', err);
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setAiResponse('');
    setError('');
  };

  const analyzeWithAI = async () => {
    if (!transcript.trim()) {
      setError('No transcript to analyze. Please record something first.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAiResponse('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcript
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.response);
      } else {
        setError(data.error || 'Failed to get AI response');
      }
    } catch (err) {
      setError('Failed to connect to AI. Make sure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    alert('Text copied to clipboard!');
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice → Text</h1>
          <p className="text-gray-600">Convert your speech to text in real-time using voice recognition.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recording Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Voice Recording</h3>
              
              <div className="flex flex-col items-center justify-center py-8">
                {isRecording ? (
                  <div className="relative">
                    <button
                      onClick={stopRecording}
                      className="w-32 h-32 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                    >
                      <StopIcon className="w-16 h-16 text-white" />
                    </button>
                    {isListening && (
                      <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={!!error && error.includes('not supported')}
                    className="w-32 h-32 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <MicrophoneIcon className="w-16 h-16 text-white" />
                  </button>
                )}
              </div>

              <p className="text-center text-gray-600 mt-4">
                {isRecording ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="font-semibold">Recording... Click to stop</span>
                  </span>
                ) : (
                  'Click the microphone to start recording'
                )}
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <p className="mb-2">{error}</p>
                  {error.includes('denied') && (
                    <button
                      onClick={requestMicrophonePermission}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Request Microphone Access
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tips for Better Results:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-7">
                <li>• <strong>Allow microphone access</strong> when browser prompts you</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Use a quiet environment for best accuracy</li>
                <li>• Speak 6-12 inches from your microphone</li>
                <li>• Works best in Chrome, Edge, or Safari</li>
              </ul>
            </div>

            {/* Permission Help */}
            {error && error.includes('denied') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">🔒 How to Enable Microphone:</h3>
                <div className="text-sm text-yellow-800 space-y-2">
                  <p><strong>Chrome/Edge:</strong></p>
                  <ol className="ml-4 space-y-1">
                    <li>1. Click the 🔒 (lock) or 🛈 icon in the address bar</li>
                    <li>2. Find "Microphone" and change to "Allow"</li>
                    <li>3. Refresh the page and try again</li>
                  </ol>
                  <p className="mt-2"><strong>Settings:</strong> chrome://settings/content/microphone</p>
                </div>
              </div>
            )}
          </div>

          {/* Transcript Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Transcript</h3>
              <div className="flex space-x-2">
                {transcript && (
                  <>
                    <button
                      onClick={analyzeWithAI}
                      disabled={isAnalyzing}
                      className="px-3 py-1 text-sm bg-primary hover:bg-primary-dark text-white rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-1"
                      title="Get AI answer"
                    >
                      {isAnalyzing ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                          <span>Ask AI</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadTranscript}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      title="Download as text file"
                    >
                      Download
                    </button>
                    <button
                      onClick={clearTranscript}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      title="Clear transcript"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg min-h-[400px] p-4 bg-gray-50">
              {transcript || interimTranscript ? (
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {transcript}
                  <span className="text-gray-500 italic">{interimTranscript}</span>
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                  <DocumentTextIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p>Your transcription will appear here</p>
                  <p className="text-sm mt-2">Start recording to see real-time text</p>
                  {isRecording && (
                    <p className="text-sm mt-2 text-blue-600 font-semibold animate-pulse">Listening... Speak now!</p>
                  )}
                </div>
              )}
            </div>

            {transcript && (
              <div className="mt-4 text-sm text-gray-500">
                Word count: {transcript.trim().split(/\s+/).filter(word => word.length > 0).length}
              </div>
            )}

            {/* AI Response Section */}
            {aiResponse && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  AI Response
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {aiResponse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceToTextPage;
