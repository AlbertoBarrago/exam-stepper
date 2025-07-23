'use client';
import AudioPlayer from "@/components/AudioPlayer";
import {useState} from "react";
import {AudioQuestion} from "@/types/stepTypes";


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
        setShowError(false);
        onNextAction();
    };

    const handleAnswerChange = (i: number, value: string) => {
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[i] = value;
            return newAnswers;
        });
        if (showError) setShowError(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                {/* Left Column - Text and Audio Player */}
                <div className="text-left p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            You will have 6 different announcements at a conference.
                            Read the 6 options and decide which one matches each announcement.
                        </p>
                        <p className="text-gray-700 mb-4">
                            You can play the recording <span className="font-bold bg-gray-100 px-1 rounded">TWO</span> times.
                        </p>
                    </div>

                    <div className="text-left float-left">
                        <AudioPlayer src={audioUrl} showMetrics={true}/>
                    </div>
                </div>

                {/* Right Column - Questions List */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="space-y-4">
                        {questions.map((q, i) => (
                            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <label className="block">
                                    <div className="text-sm font-medium text-gray-700 mb-2">
                                        Announcement {i + 1}
                                    </div>
                                    <div className="text-gray-700 mb-3">
                                        {q.before}
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={answers[i]}
                                            onChange={e => handleAnswerChange(i, e.target.value)}
                                            className={`w-full p-3 border rounded-md bg-white appearance-none cursor-pointer transition-colors ${
                                                showError && !answers[i].trim()
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                            } focus:outline-none focus:ring-2`}
                                            aria-label={`Select answer for announcement ${i + 1}`}
                                        >
                                            <option value="">Choose one option</option>
                                            {q.options.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {showError && (
                <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
                    <p className="text-red-700 text-sm font-medium">
                        Please complete all announcements before continuing.
                    </p>
                </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end mt-8">
                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}