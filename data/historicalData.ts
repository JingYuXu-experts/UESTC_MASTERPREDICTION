import type { Majors } from '../types';

// 这是一个模拟的、按专业和年份组织的结构化知识库。
// 数据按年份降序排列，最新的年份在前。
// 在真实应用中，这部分数据将由后端数据库动态提供。
export const uestcCsMajors: Majors = {
  '计算机科学与技术': {
    yearlyData: [
      { // 最近一年 (权重 60%)
        year: 2023,
        plannedAdmissions: 210,
        actualAdmissions: 212,
        cases: [
          { politics: 78, english: 80, math: 135, professional: 125, total: 418, result: '录取' },
          { politics: 75, english: 72, math: 140, professional: 130, total: 417, result: '录取' },
          { politics: 70, english: 70, math: 125, professional: 120, total: 385, result: '未录取' },
          { politics: 68, english: 65, math: 132, professional: 122, total: 387, result: '录取' },
          { politics: 69, english: 68, math: 128, professional: 118, total: 383, result: '录取' }, // 复试线案例
        ],
      },
      { // 前一年 (权重 25%)
        year: 2022,
        plannedAdmissions: 200,
        actualAdmissions: 205,
        cases: [
          { politics: 80, english: 78, math: 128, professional: 120, total: 406, result: '录取' },
          { politics: 72, english: 75, math: 130, professional: 118, total: 395, result: '录取' },
          { politics: 67, english: 66, math: 125, professional: 115, total: 373, result: '未录取' },
          { politics: 65, english: 70, math: 122, professional: 119, total: 376, result: '录取' }, // 复试线案例
        ],
      },
      { // 大前年 (权重 15%)
        year: 2021,
        plannedAdmissions: 190,
        actualAdmissions: 193,
        cases: [
          { politics: 76, english: 74, math: 133, professional: 121, total: 404, result: '录取' },
          { politics: 70, english: 71, math: 128, professional: 115, total: 384, result: '录取' },
          { politics: 66, english: 64, math: 120, professional: 110, total: 360, result: '未录取' },
          { politics: 68, english: 69, math: 124, professional: 112, total: 373, result: '录取' }, // 复试线案例
        ],
      }
    ]
  },
  '软件工程': {
    yearlyData: [
      { // 最近一年
        year: 2023,
        plannedAdmissions: 185,
        actualAdmissions: 188,
        cases: [
          { politics: 77, english: 79, math: 138, professional: 128, total: 422, result: '录取' },
          { politics: 73, english: 74, math: 131, professional: 115, total: 393, result: '录取' },
          { politics: 65, english: 68, math: 128, professional: 115, total: 376, result: '录取' }, // 复试线案例
          { politics: 66, english: 67, math: 125, professional: 116, total: 374, result: '未录取' },
        ],
      },
      { // 前一年
        year: 2022,
        plannedAdmissions: 180,
        actualAdmissions: 180,
        cases: [
          { politics: 69, english: 73, math: 129, professional: 119, total: 390, result: '录取' },
          { politics: 75, english: 71, math: 115, professional: 110, total: 371, result: '录取' }, // 复试线案例
          { politics: 64, english: 65, math: 120, professional: 112, total: 361, result: '未录取' },
        ],
      },
      { // 大前年
        year: 2021,
        plannedAdmissions: 175,
        actualAdmissions: 178,
        cases: [
          { politics: 72, english: 70, math: 130, professional: 120, total: 392, result: '录取' },
          { politics: 68, english: 68, math: 122, professional: 112, total: 370, result: '录取' }, // 复试线案例
          { politics: 63, english: 62, math: 118, professional: 110, total: 353, result: '未录取' },
        ],
      }
    ]
  },
  '人工智能': {
    yearlyData: [
      { // 最近一年
        year: 2023,
        plannedAdmissions: 65,
        actualAdmissions: 65,
        cases: [
          { politics: 82, english: 85, math: 145, professional: 138, total: 450, result: '录取' },
          { politics: 79, english: 81, math: 142, professional: 135, total: 437, result: '录取' },
          { politics: 74, english: 70, math: 135, professional: 128, total: 407, result: '录取' },
          { politics: 70, english: 68, math: 130, professional: 125, total: 393, result: '录取' }, // 复试线案例
          { politics: 71, english: 69, math: 126, professional: 121, total: 387, result: '未录取' },
        ],
      },
      { // 前一年
        year: 2022,
        plannedAdmissions: 60,
        actualAdmissions: 62,
        cases: [
           { politics: 80, english: 82, math: 140, professional: 132, total: 434, result: '录取' },
           { politics: 75, english: 72, math: 133, professional: 125, total: 405, result: '录取' },
           { politics: 68, english: 65, math: 128, professional: 120, total: 381, result: '录取' }, // 复试线案例
           { politics: 69, english: 66, math: 125, professional: 118, total: 378, result: '未录取' },
        ],
      },
      { // 大前年
        year: 2021,
        plannedAdmissions: 55,
        actualAdmissions: 55,
        cases: [
          { politics: 78, english: 80, math: 138, professional: 130, total: 426, result: '录取' },
          { politics: 72, english: 70, math: 130, professional: 122, total: 394, result: '录取' },
          { politics: 65, english: 64, math: 125, professional: 115, total: 369, result: '录取' }, // 复试线案例
          { politics: 62, english: 60, math: 120, professional: 105, total: 347, result: '未录取' },
        ],
      }
    ]
  }
};
