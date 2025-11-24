import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, AlertCircle, LogOut } from 'lucide-react';
import { Uploader } from './components/Uploader';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ApiKeySetup } from './components/ApiKeySetup';
import { analyzeImage } from './services/geminiService';
import { AdAnalysisResult, AnalysisStatus } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AdAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  const handleClearKey = () => {
    if (confirm('APIキー連携を解除しますか？')) {
      localStorage.removeItem('gemini_api_key');
      setApiKey(null);
      setResult(null);
      setStatus(AnalysisStatus.IDLE);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!apiKey) return;

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(file, apiKey);
      setResult(analysisResult);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "分析中にエラーが発生しました。");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 hidden sm:block">
              AdCreative AI Analyzer
            </h1>
            <h1 className="text-xl font-bold text-indigo-600 sm:hidden">
              AdCreative AI
            </h1>
          </div>
          <nav className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Zap size={12} className="fill-current" />
              Gemini 3.0 Pro
            </span>
            {apiKey && (
              <button
                onClick={handleClearKey}
                className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="APIキー連携を解除"
              >
                <LogOut size={18} />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!apiKey ? (
          <ApiKeySetup onSave={handleSaveKey} />
        ) : (
          <>
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                クリエイティブの「勝ち筋」を科学する
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                世界最高峰のAIモデル Gemini 3.0 Pro が、あなたの広告クリエイティブを分析。<br className="hidden md:block" />
                競合比較、改善点、ターゲット適合性を瞬時にスコアリングします。
              </p>
            </div>

            {/* Uploader Section */}
            <div className="flex justify-center mb-12">
              <Uploader 
                onFileSelect={handleFileSelect} 
                isAnalyzing={status === AnalysisStatus.ANALYZING} 
              />
            </div>

            {/* Error Message */}
            {status === AnalysisStatus.ERROR && (
              <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-4 shadow-sm">
                <AlertCircle className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">エラーが発生しました</p>
                  <p className="text-sm opacity-90">{error}</p>
                  <button 
                    onClick={() => setStatus(AnalysisStatus.IDLE)} 
                    className="mt-2 text-sm underline hover:text-red-800 font-medium"
                  >
                    もう一度試す
                  </button>
                </div>
              </div>
            )}

            {/* Results Section */}
            {status === AnalysisStatus.SUCCESS && result && (
              <ResultsDashboard result={result} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-200 mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 AdCreative AI Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;