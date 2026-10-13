import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  MessageSquare,
  Globe,
  Sparkles,
  ArrowRight,
  Clock,
  Volume2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LANGUAGES } from '../components/LanguageSelector';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/conversations');
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error('Error fetching dashboard conversations:', err);
        setError('Could not load recent conversations. Ensure the backend is reachable.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((acc, curr) => acc + (curr.messages?.length || 0), 0);

  const preferredLangObj = LANGUAGES.find((l) => l.code === user?.preferredLanguage) || LANGUAGES[0];
  const recentConversations = conversations.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome & Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/40 via-indigo-800/20 to-cyan-900/30 border border-indigo-500/20 shadow-xl backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>VoiceBridge Multilingual AI Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
              Ready to ask a question? Speak naturally in {preferredLangObj.label} ({preferredLangObj.native}) or switch languages anytime to converse with AI.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Mic className="w-4 h-4 text-indigo-200" />
              <span>Start New Voice Chat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Conversations
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{totalConversations}</span>
            <p className="text-xs text-gray-400 mt-1">Saved sessions in your account</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Questions & Answers
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{totalMessages}</span>
            <p className="text-xs text-gray-400 mt-1">Messages exchanged with AI</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Preferred Language
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {preferredLangObj.flag} {preferredLangObj.label}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              ({preferredLangObj.native})
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Default for voice recognition & audio</p>
        </div>
      </div>

      {/* Voice Features Guide Box */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-gray-800/80">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>How Voice Features Work in VoiceBridge AI</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-300">
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <p className="font-semibold text-white mb-1">1. Tap Microphone</p>
            <p className="text-gray-400">
              Click the microphone button to start Web Speech recognition. Speak your query in English, Telugu, or Hindi.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <p className="font-semibold text-white mb-1">2. Review & Edit</p>
            <p className="text-gray-400">
              Transcribed text appears directly in the prompt input. You can edit any words before dispatching to the AI.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <p className="font-semibold text-white mb-1">3. Listen to Response</p>
            <p className="text-gray-400">
              Click the speaker icon next to any response to hear it spoken aloud with browser SpeechSynthesis.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Conversations Section */}
      <div className="glass-panel rounded-3xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Conversations</h2>
            <p className="text-xs text-gray-400">Jump back into your recent interactions</p>
          </div>

          {recentConversations.length > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" text="Loading recent sessions..." />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : recentConversations.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-gray-800 p-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Mic className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No conversations yet</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              You haven't started any conversations. Ask your first question in your preferred language!
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-2"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start First Voice Chat</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentConversations.map((conv) => {
              const dateStr = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const msgCount = conv.messages?.length || 0;
              const snippet = conv.messages?.[conv.messages.length - 1]?.text || 'No messages yet';

              return (
                <div
                  key={conv._id}
                  onClick={() => navigate(`/chat/${conv._id}`)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800/80 hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="p-2 rounded-lg bg-gray-800 text-indigo-400 group-hover:bg-indigo-600/20 transition-colors shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {conv.title || 'Untitled Conversation'}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{snippet}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-xs text-gray-400">
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[11px] font-mono text-gray-300">
                      {msgCount} {msgCount === 1 ? 'msg' : 'msgs'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
