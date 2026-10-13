import React from 'react';
import { Globe } from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

export const LanguageSelector = ({ selected, onChange, className = '', compact = false }) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center gap-1.5 bg-gray-900/80 border border-gray-700/60 rounded-xl px-3 py-1.5 shadow-inner">
        <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Select preferred language"
          className="bg-transparent text-sm text-gray-200 font-medium focus:outline-none cursor-pointer pr-1"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-gray-900 text-gray-100">
              {lang.flag} {lang.label} ({lang.native})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
