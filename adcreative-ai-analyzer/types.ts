export interface AdAnalysisMetrics {
  visibility: number; // 視認性
  design: number; // デザイン力
  appeal: number; // 訴求軸/魅力
  clarity: number; // 情報の明確さ
  trust: number; // 信頼性
}

export interface AdAnalysisResult {
  overallScore: number;
  metrics: AdAnalysisMetrics;
  comparison: string; // 競合比較コメント
  pros: string[]; // 良い点
  cons: string[]; // 改善点
  improvements: string[]; // 具体的な改善案
  targetAudienceAnalysis: string; // 想定されるターゲット層への響き方
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
