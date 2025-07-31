import { formatTime } from '@/services/utilService';
import { FinalType } from '@/types/finalTypes';

const FinalRecap = ({ sectionTimes, totalSeconds, analyzing, finalScore, cefrLevel, error, backToHome }: FinalType) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">Test Complete!</h2>
      <p className="font-medium">Time spent in each section:</p>
      <div className="flex flex-col items-center gap-2 mb-2">
        {sectionTimes.map(([section, secs]) => (
          <span key={section}>
            <span className="capitalize font-semibold">{section}</span>: {formatTime(secs)}
          </span>
        ))}
      </div>
      <div className="font-bold text-lg">Total time: {formatTime(totalSeconds)}</div>
      {analyzing ? (
        <>
          <p className="text-blue-600">Analyzing results...</p>
          <div className="loader mx-auto mt-4" />
        </>
      ) : (
        <>
          {error && <p className="text-red-600">Error: {error}</p>}
          {finalScore !== null && cefrLevel !== null && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <p className="text-green-800 text-lg font-semibold">Final Score: {finalScore.toFixed(2)}%</p>
              <p className="text-green-800 text-lg font-semibold">CEFR Level: {cefrLevel}</p>
            </div>
          )}
          <button className="btn mt-4" onClick={backToHome}>
            Back to Home
          </button>
        </>
      )}
    </div>
  );
};

export default FinalRecap;
