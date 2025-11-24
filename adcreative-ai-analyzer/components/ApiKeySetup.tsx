import React, { useState } from 'react';
import { Key, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

interface ApiKeySetupProps {
  onSave: (key: string) => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-10 text-center">
          <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-inner border border-white/30">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            API連携設定
          </h2>
          <p className="mt-2 text-indigo-100 text-sm">
            Gemini 3.0 Proの高度な分析機能を利用するには、<br/>APIキーの連携が必要です。
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  required
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  placeholder="AIzaSy..."
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck size={12} className="text-green-500" />
                キーはお使いのブラウザにのみ保存されます
              </p>
            </div>

            <button
              type="submit"
              disabled={!inputKey}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              連携して開始する
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">APIキーをお持ちでない場合</h4>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
              >
                Google AI Studioで取得
                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};