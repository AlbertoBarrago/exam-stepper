import React from 'react';
import { Book, Headphones } from 'lucide-react';

interface CertificateProps {
  name: string;
  overallScore: string;
  overallLevel: string;
  awardedDate: string;
}

const Certificate: React.FC<CertificateProps> = ({
  name,
  overallScore,
  overallLevel,
  awardedDate,
}) => {
  const cefrLevels = [
    { score: '0-20', level: 'A0 Novice' },
    { score: '21-30', level: 'A1 Beginner' },
    { score: '31-40', level: 'A2 Elementary' },
    { score: '41-50', level: 'B1 Intermediate' },
    { score: '51-60', level: 'B2 Upper Intermediate' },
    { score: '61-70', level: 'C1 Advanced' },
    { score: '71-100', level: 'C2 Proficient' },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden md:p-12 p-6 transition-all duration-300 transform hover:scale-[1.01] border border-gray-200">
        <div className="text-center mb-10 border-b border-gray-200 pb-6">
          <p className="text-gray-400 font-semibold text-sm">StepWise</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight mt-2">
            English Certificate
          </h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">{name}</h2>
          <p className="text-gray-600 mt-2">
            has successfully completed the EF SET Certificate and has earned level:
          </p>
        </div>

        <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-xl py-4 px-8 text-center min-w-[200px] shadow-lg">
            <h3 className="text-lg font-bold">EF SET</h3>
            <p className="text-4xl font-extrabold mt-1">{overallScore}/100</p>
          </div>
          <div className="bg-white border-4 border-blue-600 text-blue-600 rounded-xl py-4 px-8 text-center min-w-[200px] shadow-lg">
            <h3 className="text-lg font-bold">CEFR</h3>
            <p className="text-4xl font-extrabold mt-1">{overallLevel}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-500 font-medium">Awarded on: {awardedDate}</p>
        </div>

        <div className="mb-8 p-6 rounded-xl bg-gray-50 border border-gray-200">
          <h4 className="text-xl font-semibold mb-4 text-center">Understanding the results</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 text-center text-gray-800">
            {cefrLevels.map((item, index) => {
              const overallScoreNum = parseInt(overallScore);
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-2 rounded-md ${
                    overallScoreNum >= parseInt(item.score.split('-')[0]) &&
                    overallScoreNum <= parseInt(item.score.split('-')[1])
                      ? 'bg-blue-100 border border-blue-500'
                      : ''
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">{item.score}</span>
                  <span className="text-xs text-blue-600 font-bold mt-1 uppercase">
                    {item.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 sm:mb-0 text-center sm:text-left">
            The achieved level is {overallScore}/100 on the EF SET score scale and {overallLevel}{' '}
            according to the Common European Framework of Reference (CEFR).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
