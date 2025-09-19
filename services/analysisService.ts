import type { YearlyData } from '../types';

/**
 * 基于特定专业方向过去多年的历史数据，通过加权平均计算预估的复试录取比。
 * 
 * 计算原则:
 * 1. 采用时间衰减权重：最近一年权重为60%，前一年为25%，大前年为15%。
 * 2. 对每一年，独立计算其复录比：
 *    a. 找出当年所有被录取考生中的最低总分，作为当年的预估复试线。
 *    b. 统计当年分数大于或等于此复试线的所有考生（复试池人数）。
 *    c. 复录比 = 复试池人数 / 当年实际录取人数。
 * 3. 将各年度计算出的复录比按权重加权求和，得到最终的预估复录比。
 *
 * @param {YearlyData[]} yearlyData - 一个包含多年专业数据的数组，应按年份降序排列。
 * @returns {string} - 计算出的加权平均复录比，格式化为两位小数。
 */
export const calculateHistoricalReExamRatio = (yearlyData: YearlyData[]): string => {
    const weights = [0.60, 0.25, 0.15];
    let weightedRatioSum = 0;
    let totalWeightUsed = 0;

    // 只考虑最近三年的数据
    const recentYearsData = yearlyData.slice(0, 3);

    recentYearsData.forEach((yearData, index) => {
        const admittedCases = yearData.cases.filter(c => c.result === '录取');
        if (admittedCases.length === 0 || yearData.actualAdmissions === 0) {
            return; // 如果当年没有录取数据或录取人数为0，则跳过该年份
        }

        const admissionCutoff = Math.min(...admittedCases.map(c => c.total));
        const reExamPoolCount = yearData.cases.filter(c => c.total >= admissionCutoff).length;
        const singleYearRatio = reExamPoolCount / yearData.actualAdmissions;
        
        // 确保单年比例至少为1.0
        if (!isNaN(singleYearRatio) && singleYearRatio >= 1.0) {
            const weight = weights[index];
            weightedRatioSum += singleYearRatio * weight;
            totalWeightUsed += weight;
        }
    });

    if (totalWeightUsed === 0) {
        return '1.20'; // 如果没有任何有效年份数据，返回一个保守的默认值
    }

    // 根据实际使用的权重重新计算加权平均值
    const finalRatio = weightedRatioSum / totalWeightUsed;
    
    return finalRatio.toFixed(2);
};
