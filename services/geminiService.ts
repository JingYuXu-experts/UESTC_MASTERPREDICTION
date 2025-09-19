import { GoogleGenAI, Type } from "@google/genai";
import type { Scores, HistoricalCase } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    reExaminationChance: {
        type: Type.STRING,
        description: "进入复试的概率，分为'高'、'中'、'低'三个等级。",
        enum: ['高', '中', '低'],
    },
    reExaminationAnalysis: {
        type: Type.STRING,
        description: "关于考生能否进入复试的详细分析，需要结合招生人数、复录比和历史数据来判断。",
    },
    probability: {
      type: Type.STRING,
      description: "最终录取概率，是在进入复试基础上的进一步分析，分为'高'、'中'、'低'三个等级。",
      enum: ['高', '中', '低'],
    },
    overallAnalysis: {
      type: Type.STRING,
      description: "对考生总体情况的综合分析，指出核心优势和劣势，特别是在复试竞争中的定位。语言要专业、客观、有说服力。",
    },
    subjectAnalysis: {
      type: Type.OBJECT,
      properties: {
        politics: { type: Type.STRING, description: "对政治科目的具体分析和点评。" },
        english: { type: Type.STRING, description: "对英语科目的具体分析和点评。" },
        math: { type: Type.STRING, description: "对数学科目的具体分析和点评，强调其重要性。" },
        professional: { type: Type.STRING, description: "对计算机专业基础科目的具体分析和点评，强调其重要性。" },
      },
      required: ['politics', 'english', 'math', 'professional'],
    },
    suggestions: {
      type: Type.STRING,
      description: "基于以上分析，为考生提供的具体、可操作的复习建议和备考策略。",
    },
  },
  required: ['reExaminationChance', 'reExaminationAnalysis', 'probability', 'overallAnalysis', 'subjectAnalysis', 'suggestions'],
};

const formatSimilarCases = (cases: HistoricalCase[]): string => {
    if (cases.length === 0) {
        return "无相关历史案例数据。";
    }
    return cases.map((c, index) => 
        `案例 ${index + 1}: 总分 ${c.total} (政治: ${c.politics}, 英语: ${c.english}, 数学: ${c.math}, 专业课: ${c.professional}) - 结果: ${c.result}`
    ).join('\n');
}

export const generatePrediction = async (
    scores: Scores, 
    targetScore: string, 
    similarCases: HistoricalCase[], 
    admissionQuota: number, 
    reExamRatio: string, 
    specializationName: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY 环境变量未设置");
  }

  const formattedCases = formatSimilarCases(similarCases);
  const reExamCount = Math.round(admissionQuota * parseFloat(reExamRatio));

  const prompt = `
    请为以下准备报考电子科技大学计算机科学与工程学院【${specializationName}】专业的考生进行一次全面的、分阶段的录取可能性分析。

    **招生背景信息 (重要):**
    - 报考专业: ${specializationName}
    - 最新参考计划招生人数: ${admissionQuota}人
    - 加权预估复录比: 1:${reExamRatio} (根据近三年历史数据按60/25/15权重加权计算得出，此为核心参考指标)
    - 根据以上信息，预计约有 ${reExamCount} 名考生能够进入复试环节。这是你判断复试门槛的关键依据。

    **重要参考数据 (RAG):**
    为了让你的分析更加精准，请**优先且重点参考**以下与该考生分数情况最相似的几个【真实历史案例】：
    ${formattedCases}

    **考生当前分数情况:**
    - 思想政治理论: ${scores.politics}
    - 外国语: ${scores.english}
    - 业务课一 (数学): ${scores.math}
    - 业务课二 (计算机专业基础): ${scores.professional}
    - 目标总分: ${targetScore}

    请严格按照你作为“电子科技大学【${specializationName}】专业资深招生分析专家”的角色，进行深入、两阶段的分析。

    **第一步: 进入复试概率分析**
    - 首先，基于【招生背景信息】（特别是加权复录比）和【真实历史案例】，判断考生的目标总分 ${targetScore} 在所有报考【${specializationName}】专业的考生中大概处于什么位置。
    - 评估该分数进入预计招生规模为 ${reExamCount} 人的复试名单的概率（高、中、低），并给出详细的分析（reExaminationAnalysis）。

    **第二步: 最终录取概率分析**
    - 在第一步分析的基础上，进一步评估考生在复试中的竞争力。
    - 结合考生的单科成绩（特别是数学和专业课）和总分，与参考案例进行对比，分析其在 ${reExamCount} 名复试者中脱颖而出并最终被录取的可能性（高、中、低），并给出综合分析（overallAnalysis）。

    **最后，提供完整的分析报告:**
    报告必须包含清晰的复试概率、最终录取概率、各阶段分析、单科诊断和备考建议。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `你是一位资深的电子科技大学（UESTC）计算机学院考研招生分析专家。你的任务是根据考生输入的各科分数、目标总分以及【招生背景信息】（报考专业、招生人数、经过加权计算的复录比），结合提供给你的【真实历史案例】，给出一个分阶段（进入复试、最终录取）的、详细、专业且有建设性的录取可能性分析报告。你的分析必须客观、严谨，并能给考生提供实质性的指导。你的分析范围严格限定在电子科技大学计算机学院内部的特定专业，绝不提及任何其他学校或专业。`,
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.2,
      },
    });
    return response.text;
  } catch (error) {
    console.error("调用 Gemini API 生成预测时出错:", error);
    throw new Error("AI 预测服务失败。请检查您的网络连接或 API 密钥。");
  }
};
