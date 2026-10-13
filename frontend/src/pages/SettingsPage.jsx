import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Globe,
  Volume2,
  User,
  Mail,
  Shield,
  Check,
  AlertCircle,
  LogOut,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../components/LanguageSelector';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const SettingsPage = () => {
  const { user, updatePreferences, logout } = useAuth();
  const navigate = useNavigate();

  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [autoPlaySpeech, setAutoPlaySpeech] = useState(user?.autoPlaySpeech || false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updatePreferences({
        preferredLanguage,
        autoPlaySpeech,
      });
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating settings:', err);
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          <span>Account & Voice Settings</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Customize your language preferences, speech output, and account credentials
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Voice & Language Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-gray-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-gray-800">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>Voice & Language Preferences</span>
          </h2>

          {/* Preferred Language Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Default Conversation Language
            </label>
            <p className="text-xs text-gray-400">
              The AI will automatically prioritize this language for speech recognition and synthesized voice responses.
            </p>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label} ({lang.native})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-TTS Toggle */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div>
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Auto-play Speech Responses</span>
              </label>
              <p className="text-xs text-gray-400 mt-0.5">
                Automatically read the AI assistant's answers aloud via Text-to-Speech when received.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoPlaySpeech}
                onChange={(e) => setAutoPlaySpeech(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-gray-800">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Profile Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5" /> Full Name
              </span>
              <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </span>
              <p className="text-sm font-semibold text-white">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-sm border border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
