import { formatTime } from '@/services/commonService';
import { FinalType } from '@/types/finalTypes';

const FinalRecap = ({ sectionTimes, totalSeconds, analyzing, backToHome }: FinalType): void => {
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
          <p className="text-green-600">Your results will be available shortly.</p>
          <button className="btn mt-4" onClick={backToHome}>
            Back to Home
          </button>
        </>
      )}
    </div>
  );
};

export default FinalRecap;
