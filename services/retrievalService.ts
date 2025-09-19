import type { HistoricalCase } from '../types';

/**
 * 从给定的案例列表中查找N个最相似的历史案例。
 * @param targetScore 用户的目标总分。
 * @param cases 要从中检索的特定专业历史案例数组。
 * @param count 要返回的相似案例数量。
 * @returns 一个包含最相似历史案例的数组。
 */
export const findSimilarCases = (targetScore: string, cases: HistoricalCase[], count: number = 5): HistoricalCase[] => {
  const userTotal = parseInt(targetScore, 10);
  if (isNaN(userTotal)) {
    return [];
  }

  // 计算每个历史案例与目标总分的差值。
  const scoredCases = cases.map(caseData => ({
    ...caseData,
    difference: Math.abs(caseData.total - userTotal),
  }));

  // 根据差值从小到大排序。
  scoredCases.sort((a, b) => a.difference - b.difference);

  // 返回最接近的N个案例。
  return scoredCases.slice(0, count);
};
