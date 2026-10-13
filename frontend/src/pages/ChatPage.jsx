import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Plus,
  Volume2,
  VolumeX,
  AlertCircle,
  Sparkles,
  Globe,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSpeechRecognition, getLangLocale } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import api from '../services/api';
import ChatMessage from '../components/ChatMessage';
import AudioVisualizer from '../components/AudioVisualizer';
import LanguageSelector, { LANGUAGES } from '../components/LanguageSelector';
import LoadingSpinner from '../components/LoadingSpinner';

export const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentId, setCurrentId] = useState(conversationId || null);
  const [messages, setMessages] = useState([]);
  const [conversationTitle, setConversationTitle] = useState('New Voice Chat');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferredLanguage || 'en');
  const [inputText, setInputText] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Text-To-Speech hook
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    activeUtteranceId,
    isSupported: isTtsSupported
  } = useSpeechSynthesis();

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported: isSttSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript
  } = useSpeechRecognition({
    language: selectedLanguage,
    onResult: (latestText) => {
      // Sync recognized speech into input text box so user can see and edit it
      setInputText(latestText);
    }
  });

  // Load conversation if conversationId is provided in URL
  useEffect(() => {
    if (conversationId) {
      setCurrentId(conversationId);
      loadConversation(conversationId);
    } else {
      // New conversation reset
      setCurrentId(null);
      setMessages([]);
      setConversationTitle('New Voice Chat');
    }
  }, [conversationId]);

  // Sync default language from user preferences if not changed
  useEffect(() => {
    if (user?.preferredLanguage) {
      setSelectedLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi, isListening]);

  const loadConversation = async (id) => {
    try {
      setLoadingConversation(true);
      setErrorMessage('');
      const res = await api.get(`/conversations/${id}`);
      const conv = res.data.conversation;
      setConversationTitle(conv.title || 'Voice Conversation');
      setMessages(conv.messages || []);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setErrorMessage('Could not load this conversation. It may have been deleted.');
    } finally {
      setLoadingConversation(false);
    }
  };

  const handleStartNewChat = () => {
    stopSpeaking();
    if (isListening) stopListening();
    resetTranscript();
    setInputText('');
    setCurrentId(null);
    setMessages([]);
    setConversationTitle('New Voice Chat');
    navigate('/chat');
  };

  const handleSendMessage = async (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoadingAi) return;

    if (isListening) {
      stopListening();
    }

    setErrorMessage('');
    setLastFailedMessage(null);
    resetTranscript();
    setInputText('');

    const userMessage = {
      role: 'user',
      text: trimmed,
      language: selectedLanguage,
      timestamp: new Date().toISOString(),
    };

    // Optimistically update message feed
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoadingAi(true);

    try {
      const payload = {
        conversationId: currentId,
        message: trimmed,
        language: selectedLanguage,
        history: updatedMessages.slice(-10), // Pass recent context
      };

      const res = await api.post('/chat', payload);
      const { reply, conversationId: returnedId, title: returnedTitle } = res.data;

      // Update active ID if this was a new conversation
      if (returnedId && (!currentId || currentId !== returnedId)) {
        setCurrentId(returnedId);
        // Softly update URL without reloading
        window.history.replaceState(null, '', `/chat/${returnedId}`);
      }

      if (returnedTitle) {
        setConversationTitle(returnedTitle);
      }

      const assistantMessage = {
        role: 'assistant',
        text: reply,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If user enabled auto-play speech, trigger TTS automatically
      if (user?.autoPlaySpeech && isTtsSupported) {
        speak(reply, selectedLanguage, updatedMessages.length);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMsg =
        err.response?.data?.message ||
        'The AI service encountered an error. Please verify the backend connection and Gemini API key.';
      setErrorMessage(errorMsg);
      setLastFailedMessage(trimmed);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-[920px] bg-gray-900/60 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Mic className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate">{conversationTitle}</h2>
            <p className="text-[11px] text-gray-400 truncate">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'} in session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <LanguageSelector
            selected={selectedLanguage}
            onChange={(newLang) => {
              setSelectedLanguage(newLang);
              if (isListening) {
                stopListening();
              }
            }}
          />

          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition-colors"
            title="Start new conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {loadingConversation ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading conversation..." />
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat Welcome State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4 animate-bounce-subtle">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">VoiceBridge AI is Ready</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
              Ask anything about admissions, scholarships, exam dates, or college procedures. You can click the microphone to speak or type in{' '}
              <strong className="text-indigo-300">
                {LANGUAGES.find((l) => l.code === selectedLanguage)?.label}
              </strong>
              .
            </p>

            {/* Starter Suggestion Chips */}
            <div className="grid grid-cols-1 gap-2 w-full mt-6 text-left">
              {[
                selectedLanguage === 'te'
                  ? 'స్కాలర్‌షిప్ ఎలా దరఖాస్తు చేసుకోవాలి?'
                  : selectedLanguage === 'hi'
                  ? 'स्कॉलरशिप के लिए कैसे आवेदन करें?'
                  : 'How do I apply for student financial aid?',
                selectedLanguage === 'te'
                  ? 'సెమిస్టర్ పరీక్షల కోసం ఎలా సిద్ధం కావాలి?'
                  : selectedLanguage === 'hi'
                  ? 'सेमेस्टर परीक्षा के लिए कैसे तैयारी करें?'
                  : 'What are the main university admission requirements?',
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(starter);
                    handleSendMessage(starter);
                  }}
                  className="p-3 rounded-xl bg-gray-800/60 hover:bg-indigo-600/20 border border-gray-700/60 hover:border-indigo-500/40 text-xs text-gray-300 hover:text-white transition-all text-left flex items-center justify-between group"
                >
                  <span className="truncate">{starter}</span>
                  <Send className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Render Messages */
          <>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
                index={index}
                isSpeakingThis={isSpeaking && activeUtteranceId === index}
                onSpeak={(text, lang) => speak(text, lang, index)}
                onStopSpeak={stopSpeaking}
              />
            ))}

            {/* AI Thinking Indicator */}
            {isLoadingAi && (
              <div className="flex items-center gap-3 my-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-800/80 border border-gray-700 text-xs text-indigo-300">
                  <LoadingSpinner size="sm" />
                  <span>VoiceBridge AI is thinking...</span>
                </div>
              </div>
            )}

            {/* Error & Retry Banner */}
            {errorMessage && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
                {lastFailedMessage && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-medium transition-colors w-fit"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Question</span>
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Speech Recognition Error Pill */}
      {speechError && (
        <div className="px-4 py-2 bg-rose-950/40 border-t border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Voice Status Pill (Listening / Speaking) */}
      {(isListening || isSpeaking) && (
        <div className="px-4 py-2 bg-indigo-950/50 border-t border-indigo-800/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2.5 text-indigo-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span>
              {isListening
                ? `Listening in ${LANGUAGES.find((l) => l.code === selectedLanguage)?.label}...`
                : 'Reading response aloud...'}
            </span>
            <AudioVisualizer isActive={true} mode={isListening ? 'recording' : 'speaking'} />
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="text-indigo-400 hover:text-white flex items-center gap-1 text-[11px] font-semibold"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Voice</span>
            </button>
          )}
        </div>
      )}

      {/* Input Controls Footer */}
      <div className="p-4 bg-gray-900/90 border-t border-gray-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Microphone Recording Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-indigo-400" />
            )}
          </button>

          {/* Editable text input box */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoadingAi}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : `Type or speak in ${LANGUAGES.find((l) => l.code === selectedLanguage)?.label}...`
              }
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            />

            {interimTranscript && isListening && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-400 italic font-mono pointer-events-none">
                {interimTranscript}
              </span>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoadingAi}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
