import React from 'react';
import { AdAnalysisResult } from '../types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Award, Eye, Layout, MousePointer, Type, ShieldCheck, BarChart2 } from 'lucide-react';

interface ResultsDashboardProps {
  result: AdAnalysisResult;
}

const MetricCard: React.FC<{ label: string; score: number; icon: React.ReactNode; description: string }> = ({ label, score, icon, description }) => {
  let colorClass = "text-slate-600";
  let bgClass = "bg-slate-100";
  let ringClass = "ring-slate-100";
  
  if (score >= 8) {
    colorClass = "text-green-600";
    bgClass = "bg-green-50";
    ringClass = "ring-green-100";
  } else if (score >= 5) {
    colorClass = "text-amber-600";
    bgClass = "bg-amber-50";
    ringClass = "ring-amber-100";
  } else {
    colorClass = "text-red-600";
    bgClass = "bg-red-50";
    ringClass = "ring-red-100";
  }

  return (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1 ring-4 ${ringClass} ring-opacity-50`}>
      <div className={`p-3 rounded-full ${bgClass} ${colorClass} mb-3`}>
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-slate-700 mb-1">{label}</h4>
      <div className={`text-3xl font-bold ${colorClass} tracking-tight`}>{score}<span className="text-xs text-slate-400 ml-1 font-medium">/10</span></div>
      <p className="text-xs text-slate-500 mt-2 leading-tight">{description}</p>
    </div>
  );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const chartData = [
    { subject: '視認性', A: result.metrics.visibility, fullMark: 10 },
    { subject: 'デザイン', A: result.metrics.design, fullMark: 10 },
    { subject: '訴求力', A: result.metrics.appeal, fullMark: 10 },
    { subject: '信頼性', A: result.metrics.trust, fullMark: 10 },
    { subject: '明確さ', A: result.metrics.clarity, fullMark: 10 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Top Section: Overall Score & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Summary */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h2 className="text-slate-500 font-semibold mb-2 uppercase tracking-widest text-xs">総合スコア</h2>
          <div className="relative mb-4">
             <span className="text-8xl font-black text-slate-800 tracking-tighter leading-none">{result.overallScore}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            {result.overallScore >= 80 ? (
               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Excellent</span>
            ) : result.overallScore >= 60 ? (
               <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase">Good</span>
            ) : (
               <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">Improve</span>
            )}
          </div>

          <div className="w-full pt-6 border-t border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
               <BarChart2 size={12} /> 競合比較分析
             </h3>
             <p className="text-sm text-slate-600 text-left leading-relaxed">
              {result.comparison}
             </p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2 px-2">
            <TrendingUp className="text-indigo-600" size={20} />
            パフォーマンス分析
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard label="視認性" score={result.metrics.visibility} icon={<Eye size={20}/>} description="フィードでの目立ちやすさ" />
        <MetricCard label="デザイン" score={result.metrics.design} icon={<Layout size={20}/>} description="構成と美的品質" />
        <MetricCard label="訴求力" score={result.metrics.appeal} icon={<MousePointer size={20}/>} description="クリックしたくなる魅力" />
        <MetricCard label="明確さ" score={result.metrics.clarity} icon={<Type size={20}/>} description="内容の伝わりやすさ" />
        <MetricCard label="信頼性" score={result.metrics.trust} icon={<ShieldCheck size={20}/>} description="ブランドへの安心感" />
      </div>

      {/* Qualitative Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros & Cons */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Award className="text-amber-500" size={20} />
             評価詳細
           </h3>
           
           <div className="mb-8">
             <h4 className="text-xs font-bold text-green-600 uppercase mb-4 flex items-center gap-2 bg-green-50 inline-block px-3 py-1 rounded-full">
               <CheckCircle2 size={14} /> GOOD POINTS
             </h4>
             <ul className="space-y-4">
               {result.pros.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                   <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                   {item}
                 </li>
               ))}
             </ul>
           </div>

           <div>
             <h4 className="text-xs font-bold text-red-500 uppercase mb-4 flex items-center gap-2 bg-red-50 inline-block px-3 py-1 rounded-full">
               <AlertCircle size={14} /> WEAK POINTS
             </h4>
             <ul className="space-y-4">
               {result.cons.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                   <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></span>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </div>

        {/* Actionable Improvements */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
           
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
             <Lightbulb className="text-blue-600" size={20} />
             改善アクションプラン
           </h3>
           <div className="space-y-4 flex-1 relative z-10">
             {result.improvements.map((item, idx) => (
               <div key={idx} className="bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-xl p-4 flex gap-4 transition-colors group">
                 <div className="bg-white text-slate-400 group-hover:text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-slate-100 transition-colors">
                   {idx + 1}
                 </div>
                 <p className="text-slate-700 text-sm leading-relaxed pt-1 font-medium">
                   {item}
                 </p>
               </div>
             ))}
           </div>
           
           <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
             <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">ターゲットインサイト</h4>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
               "{result.targetAudienceAnalysis}"
             </div>
           </div>
        </div>
      </div>

    </div>
  );
};