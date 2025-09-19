import React, { useState, useCallback, useMemo } from 'react';
import { generatePrediction } from './services/geminiService';
import { findSimilarCases } from './services/retrievalService';
import { calculateHistoricalReExamRatio } from './services/analysisService';
import { uestcCsMajors } from './data/historicalData';
import type { Scores, PredictionResult, SubjectKey } from './types';
import ScoreInput from './components/ScoreInput';
import ResultCard from './components/ResultCard';
import { BrainCircuitIcon, LoaderIcon, GraduationCapIcon } from './components/icons';

const initialScores: Scores = {
  politics: '',
  english: '',
  math: '',
  professional: '',
};

const subjectConfig: { key: SubjectKey; label: string; placeholder: string; max: number }[] = [
    { key: 'politics', label: '思想政治理论', placeholder: '例如: 75', max: 100 },
    { key: 'english', label: '外国语', placeholder: '例如: 70', max: 100 },
    { key: 'math', label: '业务课一 (数学)', placeholder: '例如: 125', max: 150 },
    { key: 'professional', label: '业务课二 (计算机专业基础)', placeholder: '例如: 130', max: 150 },
];

const majorNames = Object.keys(uestcCsMajors);

const App: React.FC = () => {
  const [scores, setScores] = useState<Scores>(initialScores);
  const [targetScore, setTargetScore] = useState<string>('390');
  const [selectedMajor, setSelectedMajor] = useState<string>(majorNames[0]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentMajorData = uestcCsMajors[selectedMajor];
  // 最新一年的数据作为参考基准
  const latestYearData = currentMajorData.yearlyData[0]; 

  // 使用 useMemo 优化，仅在专业数据变化时重新计算加权复录比
  const reExamRatio = useMemo(() => 
    calculateHistoricalReExamRatio(currentMajorData.yearlyData), 
    [currentMajorData]
  );

  const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, subject: SubjectKey) => {
    setScores(prev => ({ ...prev, [subject]: e.target.value }));
  }, []);

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMajor(e.target.value);
      setResult(null); // 专业变化时清空旧的预测结果
      setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // 1. 检索步骤 (RAG) - 从所有年份的案例中查找最相似的
      const allCases = currentMajorData.yearlyData.flatMap(data => data.cases);
      const similarCases = findSimilarCases(targetScore, allCases);

      // 2. 增强生成步骤 (RAG) - 传入所有特定于专业的数据
      const responseText = await generatePrediction(
        scores, 
        targetScore, 
        similarCases, 
        latestYearData.plannedAdmissions, // 使用最新一年的计划招生人数
        reExamRatio,
        selectedMajor
      );
      const parsedResult: PredictionResult = JSON.parse(responseText);

      // 将用于预测的案例附加到结果对象中以便显示
      parsedResult.similarCases = similarCases;
      setResult(parsedResult);

    } catch (err: any) {
      setError(err.message || '预测失败，请检查输入或稍后再试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
              <BrainCircuitIcon className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                电子科技大学计算机学院考研预测
              </h1>
          </div>
          <p className="text-gray-500">
            基于 AI (RAG) 与加权数据模型分析，助您科学评估录取几率
          </p>
        </header>

        <main className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <GraduationCapIcon className="w-5 h-5 mr-2 text-gray-500"/>
                    请选择您要报考的专业方向
                </label>
                <select
                    value={selectedMajor}
                    onChange={handleMajorChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out appearance-none bg-no-repeat bg-right-8"
                    style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em'}}
                >
                    {majorNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                {subjectConfig.map(subject => (
                     <ScoreInput
                        key={subject.key}
                        label={subject.label}
                        value={scores[subject.key]}
                        onChange={(e) => handleScoreChange(e, subject.key)}
                        placeholder={subject.placeholder}
                        max={subject.max}
                        min={0}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
               <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">计划招生人数 (参考{latestYearData.year}年)</label>
                  <div className="w-full px-4 py-2 text-gray-600 bg-gray-100 border border-gray-200 rounded-md">
                    {latestYearData.plannedAdmissions} 人
                  </div>
               </div>
               <div>
                <ScoreInput
                    label="目标总分"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    placeholder="例如: 390"
                    max={500}
                    min={0}
                />
              </div>
            </div>

            <div className="text-center mt-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p>
                    根据<span className="font-bold text-gray-800">「{selectedMajor}」</span>专业近三年数据加权分析，当前预估复录比为 <span className="font-bold text-blue-600">1 : {reExamRatio}</span>
                </p>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    AI 分析中...
                  </>
                ) : (
                  '开始智能预测'
                )}
              </button>
            </div>
          </form>
        </main>
        
        {error && (
            <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                <p className="font-bold">发生错误</p>
                <p>{error}</p>
            </div>
        )}

        {result && <ResultCard result={result} />}

        {!isLoading && !result && !error && (
            <div className="text-center mt-8 text-gray-500">
                <p>请选择您的专业方向并输入分数，开始预测。</p>
            </div>
        )}

      </div>
       <footer className="text-center mt-8 text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} UESTC 考研预测平台。保留所有权利。</p>
        <p className="mt-1">预测结果由 AI 生成，仅供参考，不构成最终录取依据。</p>
      </footer>
    </div>
  );
};

export default App;
