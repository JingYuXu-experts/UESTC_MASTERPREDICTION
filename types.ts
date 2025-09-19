export interface Scores {
  politics: string;
  english: string;
  math: string;
  professional: string;
}

export interface SubjectAnalysis {
  politics: string;
  english: string;
  math: string;
  professional: string;
}

export interface HistoricalCase {
  politics: number;
  english: number;
  math: number;
  professional: number;
  total: number;
  result: '录取' | '未录取';
}

export interface PredictionResult {
  reExaminationChance: '高' | '中' | '低';
  reExaminationAnalysis: string;
  probability: '高' | '中' | '低';
  overallAnalysis: string;
  subjectAnalysis: SubjectAnalysis;
  suggestions: string;
  similarCases?: HistoricalCase[]; // 添加相似案例用于RAG展示
}

export type SubjectKey = keyof Scores;

// --- 架构升级：引入时间序列数据 ---

// 定义单一年份的数据结构
export interface YearlyData {
  year: number;
  plannedAdmissions: number; // 计划招生人数
  actualAdmissions: number;  // 实际录取人数
  cases: HistoricalCase[];   // 当年的历史案例
}

// 定义单个专业的数据结构，包含多年的数据记录
export interface MajorData {
  yearlyData: YearlyData[];
}

// 定义整个学院的专业数据结构，键为专业名称
export interface Majors {
  [key:string]: MajorData;
}
