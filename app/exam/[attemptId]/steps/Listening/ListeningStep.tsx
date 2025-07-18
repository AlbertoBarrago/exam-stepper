'use client';
import CircularAudioPlayer from "@/components/CircularAudioPlayer";
import {useState} from "react";
import {AudioQuestion} from "@/lib/steps";


export default function ListeningStep({
                                      audioUrl,
                                      onNextAction,
                                      questions
                                  }: {
    audioUrl: string;
    onNextAction: () => void;
    questions: AudioQuestion[]
}) {
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
    const [showError, setShowError] = useState(false);


    const handleNext = () => {
        const allFilled = answers.every((ans: string) => ans.trim() !== "");
        if (!allFilled) {
            setShowError(true);
            return;
        }

        // TODO: check correctness here or log to backend
        onNextAction();
    };

    const handleAnswerChange = (i: number, value: string) => {
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[i] = value;
            return newAnswers;
        });
    }

    return (
        <div>
            <p className="mb-4">Listen to the audio and complete the sentences:</p>
            <CircularAudioPlayer src={audioUrl}/>

            <div className="mt-6 space-y-4">
                {questions.map((q, i) => (
                    <div key={q.id}>
                        <label className="block text-lg">
                            <p>{q.before}
                                <select
                                    value={answers[i]}
                                    onChange={e => handleAnswerChange(i, e.target.value)}
                                >
                                    <option value="">Select an option...</option>
                                    {q.options.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </p>
                        </label>
                    </div>
                ))}
            </div>

            {showError && (
                <p className="text-red-500 mt-2">Please complete all the sentences.</p>
            )}

            <button className="btn mt-6 ml-4" onClick={handleNext}>
                Next →
            </button>
        </div>
    );
}