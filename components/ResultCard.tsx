import React from 'react';
import type { PredictionResult, SubjectKey, HistoricalCase } from '../types';
import { BookOpenIcon, CheckCircleIcon, DatabaseIcon } from './icons';

interface ResultCardProps {
  result: PredictionResult;
}

const getProbabilityClass = (probability: '高' | '中' | '低') => {
  switch (probability) {
    case '高':
      return 'bg-green-100 text-green-800 border-green-400';
    case '中':
      return 'bg-yellow-100 text-yellow-800 border-yellow-400';
    case '低':
      return 'bg-red-100 text-red-800 border-red-400';
  }
};

const subjectLabels: Record<SubjectKey, string> = {
  politics: '思想政治理论',
  english: '外国语',
  math: '数学',
  professional: '计算机专业基础',
};

const SimilarCases: React.FC<{ cases: HistoricalCase[] }> = ({ cases }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <DatabaseIcon className="w-5 h-5 mr-2 text-indigo-600"/>
            参考历史案例 (RAG)
        </h3>
        <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 space-y-2">
            <p className="text-sm text-indigo-700 mb-3">AI重点参考了以下与您目标总分最接近的历史数据进行分析：</p>
            {cases.map((c, index) => (
                <div key={index} className={`text-sm p-2 rounded-md ${c.result === '录取' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`font-bold ${c.result === '录取' ? 'text-green-800' : 'text-red-800'}`}>
                        {`案例 ${index + 1} (${c.result}): `}
                    </span>
                    <span className="text-gray-700">
                        {`总分 ${c.total} (政:${c.politics}, 英:${c.english}, 数:${c.math}, 专:${c.professional})`}
                    </span>
                </div>
            ))}
        </div>
    </div>
);


const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="mt-8 w-full animate-fade-in bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">AI 录取可能性分析报告</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">进入复试概率</h3>
            <div className={`text-center py-3 px-4 rounded-lg font-bold text-xl border ${getProbabilityClass(result.reExaminationChance)}`}>
            {result.reExaminationChance}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">最终录取概率</h3>
            <div className={`text-center py-3 px-4 rounded-lg font-bold text-xl border ${getProbabilityClass(result.probability)}`}>
            {result.probability}
            </div>
        </div>
      </div>
      
      {result.similarCases && result.similarCases.length > 0 && (
          <SimilarCases cases={result.similarCases} />
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">复试门槛分析</h3>
        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">{result.reExaminationAnalysis}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">综合录取分析</h3>
        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">{result.overallAnalysis}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">单科诊断</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(result.subjectAnalysis).map(([key, analysis]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800">{subjectLabels[key as SubjectKey]}</h4>
              <p className="text-gray-600 text-sm mt-1">{analysis}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2 text-blue-600"/>
            备考建议
        </h3>
        <div className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
           {result.suggestions.split('\n').map((line, index) => (
             <p key={index} className="mb-2 last:mb-0">{line}</p>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;