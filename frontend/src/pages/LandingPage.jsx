import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Volume2,
  Globe,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  MessageSquare,
  Bot
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-gray-800/80 bg-gray-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                VoiceBridge AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-gray-800/60 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Breaking Language Barriers with Voice AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Speak in your language.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              Empower your future.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            VoiceBridge AI connects students and communities to organizations through voice. Speak or type in
            <span className="text-indigo-300 font-medium"> Telugu</span>,
            <span className="text-cyan-300 font-medium"> Hindi</span>, or
            <span className="text-indigo-200 font-medium"> English</span>, receive intelligent answers, and listen aloud.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Mic className="w-5 h-5 text-indigo-200" />
              <span>Try Voice Assistant Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gray-800/80 hover:bg-gray-700 text-gray-200 font-medium text-base border border-gray-700/60 transition-all"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Interactive Feature Demo Showcase Card */}
        <div className="max-w-3xl mx-auto mt-16 relative z-10">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 border border-gray-700/60">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-gray-400 font-mono ml-2">Live Voice Experience</span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>Multilingual: EN • TE • HI</span>
              </div>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-md shadow-md">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
                    <Mic className="w-3.5 h-3.5" />
                    <span>User (Voice Input in Telugu)</span>
                  </div>
                  <p className="text-sm">నాకు ఇంజనీరింగ్ స్కాలర్‌షిప్ ఎలా దరఖాస్తు చేసుకోవాలో వివరించగలరా?</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-800/90 border border-gray-700 text-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm max-w-md shadow-md">
                  <div className="flex items-center justify-between text-xs text-indigo-400 mb-1">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      VoiceBridge AI
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      Audio Ready
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    తప్పకుండా! ఇంజనీరింగ్ స్కాలర్‌షిప్ దరఖాస్తు చేసుకోవడానికి 3 ప్రధాన దశలు ఉన్నాయి: మీ అకడమిక్ సర్టిఫికెట్లు, ఆదాయ ధృవీకరణ పత్రం సమర్పించండి...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Feature Cards */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Engineered for Accessibility & Clarity
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Combining browser-native speech recognition with modern conversational AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-7 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Native Multilingual</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Designed for English, Telugu (తెలుగు), and Hindi (हिन्दी). The AI understands regional context, colloquial questions, and university inquiries.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hands-Free Speech Input</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Activate the microphone with one tap. View your spoken words converted to editable text live before sending, ensuring complete accuracy.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Listen Aloud (TTS)</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hear every response spoken with speech synthesis in your preferred language. Great for students on the move or users who prefer auditory guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience / Use Cases */}
      <section className="py-16 px-6 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-4">
              <GraduationCap className="w-4 h-4" />
              <span>Student & Citizen Inclusivity</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Empowering Students with Institution Knowledge
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Many students struggle to ask questions about admissions, fees, hostel regulations, and exams because forms and helplines are only in English. VoiceBridge AI bridges that gap effortlessly.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Private & secure session history stored in MongoDB</span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800/80 py-8 px-6 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} VoiceBridge AI. Built for accessibility & multilingual innovation.</p>
          <div className="flex items-center gap-6 text-gray-400 text-xs">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
