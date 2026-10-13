import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  MessageSquare,
  Trash2,
  ExternalLink,
  Calendar,
  AlertCircle,
  Plus,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const HistoryPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Error fetching conversation history:', err);
      setError('Failed to fetch conversation history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Error deleting conversation:', err);
      alert('Failed to delete conversation. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (c.title || '').toLowerCase().includes(q);
    const contentMatch = (c.messages || []).some((m) => (m.text || '').toLowerCase().includes(q));
    return titleMatch || contentMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-indigo-400" />
            <span>Conversation History</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review and resume all your past multilingual voice sessions
          </p>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations by keywords, questions or titles..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" text="Loading your history..." />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-gray-800">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {searchQuery ? 'No matching conversations found' : 'No history yet'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try searching with different terms or clear the filter.'
              : 'Your voice interactions and answers will be safely saved here.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/chat')}
              className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start First Conversation</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConversations.map((conv) => {
            const formattedDate = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const lastMessage = conv.messages?.[conv.messages.length - 1]?.text || 'No messages';
            const count = conv.messages?.length || 0;

            return (
              <div
                key={conv._id}
                onClick={() => navigate(`/chat/${conv._id}`)}
                className="glass-card rounded-2xl p-5 border border-gray-800 hover:border-indigo-500/40 cursor-pointer flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {conv.title || 'Untitled Conversation'}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(conv._id, e)}
                      disabled={deletingId === conv._id}
                      title="Delete conversation"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {lastMessage}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formattedDate}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 font-mono">
                      {count} msgs
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
