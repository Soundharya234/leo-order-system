import React, { useState, useEffect } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript.toLowerCase();
      setTranscript(speechToText);
      handleCommand(speechToText);
    };

    recognition.onerror = (event) => {
      setError('Error occurred in recognition: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const handleCommand = (command) => {
    console.log('Command Received:', command);
    
    if (command.includes('show products') || command.includes('check inventory')) {
      navigate('/inventory');
    } else if (command.includes('add product') || command.includes('new product')) {
      navigate('/inventory'); // Or to a specific modal if implemented
    } else if (command.includes('show customers') || command.includes('customer list')) {
      navigate('/customers');
    } else if (command.includes('check stock') || command.includes('stock level')) {
      navigate('/inventory');
    } else if (command.includes('today sales') || command.includes('dashboard') || command.includes('show sales')) {
      navigate('/');
    } else if (command.includes('billing') || command.includes('pos')) {
      navigate('/pos');
    } else {
      setError(`Unknown command: "${command}"`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      if (!recognition) {
        setError('Browser does not support Speech Recognition.');
        return;
      }
      recognition.start();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
        }`}
        title="Voice Commands"
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      
      {transcript && (
        <div className="absolute bottom-20 left-64 bg-slate-800 text-teal-400 px-4 py-2 rounded-lg border border-teal-500/30 text-sm shadow-xl z-50 animate-bounce">
          "{transcript}"
        </div>
      )}
      
      {error && (
        <div className="absolute bottom-20 left-64 bg-red-900/80 text-red-200 px-4 py-2 rounded-lg border border-red-500/30 text-xs shadow-xl z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceCommand;
