import { FinalType } from '@/types/finalTypes';
import Certificate from './Certificate';

const FinalRecap = ({
  analyzing,
  finalScore,
  cefrLevel,
  error,
  backToHome,
  displayName,
  awardedDate,
  stepScores,
}: FinalType) => {
  return (
    <div className="text-center space-y-2">
      {analyzing ? (
        <>
          <p className="text-blue-600">Analyzing results...</p>
          <div className="loader mx-auto mt-4" />
        </>
      ) : (
        <>
          {error && <p className="text-red-600">Error: {error}</p>}
          {(finalScore || finalScore === 0) && cefrLevel !== null && (
            <Certificate
              overallScore={finalScore.toFixed(0)}
              overallLevel={cefrLevel.global_cefr_level}
              name={displayName}
              awardedDate={awardedDate}
              stepScores={stepScores}
              readingCefrLevel={cefrLevel.reading_cefr_level}
              listeningCefrLevel={cefrLevel.listening_cefr_level}
              speakingCefrLevel={cefrLevel.speaking_cefr_level}
              writingCefrLevel={cefrLevel.writing_cefr_level}
            />
          )}
          <button className="btn mt-4" onClick={backToHome}>
            Exit Test
          </button>
        </>
      )}
    </div>
  );
};

export default FinalRecap;
