import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Bot, User, Sparkles } from 'lucide-react';
import { LANGUAGES } from './LanguageSelector';

export const ChatMessage = ({
  message,
  index,
  onSpeak,
  onStopSpeak,
  isSpeakingThis,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text || message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLangBadge = (langCode) => {
    const lang = LANGUAGES.find((l) => l.code === langCode);
    return lang ? `${lang.flag} ${lang.label}` : langCode?.toUpperCase();
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`flex gap-3.5 my-4 transition-all duration-200 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20 mt-1">
          <Sparkles className="w-5 h-5 text-indigo-100" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md relative group ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm border border-indigo-500/30'
            : 'bg-gray-800/80 border border-gray-700/60 text-gray-100 rounded-tl-sm backdrop-blur-md'
        }`}
      >
        {/* Header metadata row */}
        <div className="flex items-center justify-between gap-3 mb-1 text-[11px] font-medium opacity-75">
          <span className="flex items-center gap-1.5 font-semibold">
            {isUser ? 'You' : 'VoiceBridge AI'}
            {message.language && (
              <span className="px-1.5 py-0.5 rounded-md bg-black/25 text-[10px] font-mono">
                {getLangBadge(message.language)}
              </span>
            )}
          </span>
          <span>{formattedTime}</span>
        </div>

        {/* Message body text */}
        <div className="text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap font-normal break-words">
          {message.text || message.content}
        </div>

        {/* Footer actions for assistant message: TTS & Copy */}
        <div
          className={`flex items-center gap-1 mt-2.5 pt-2 border-t ${
            isUser ? 'border-indigo-500/30 justify-end' : 'border-gray-700/50 justify-between'
          }`}
        >
          {!isUser && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isSpeakingThis) {
                    onStopSpeak?.();
                  } else {
                    onSpeak?.(message.text || message.content, message.language || 'en', index);
                  }
                }}
                title={isSpeakingThis ? 'Stop playback' : 'Listen to response'}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSpeakingThis
                    ? 'bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-400 animate-pulse'
                    : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                {isSpeakingThis ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-gray-300" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy text"
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-gray-700 flex items-center justify-center text-gray-200 shrink-0 border border-gray-600/50 mt-1">
          <User className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
