import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {ReadingPassageProps} from "@/types/readingTypes";


const ReadingPassage: React.FC<ReadingPassageProps> = ({
                                                           passage,
                                                           questions,
                                                           currentQuestionIndex = 0,
                                                           onAnswerChange,
                                                           onNextAction,
                                                           onPrevious,
                                                           answers,
                                                           showPrevious = false
                                                       }) => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion?.id];

    const handleOptionSelect = (optionIndex: number) => {
        if (!currentQuestion) return;

        if (currentQuestion.type === 'single') {
            onAnswerChange(currentQuestion.id, optionIndex);
        } else {
            const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
            const newAnswers = currentAnswers.includes(optionIndex)
                ? currentAnswers.filter(index => index !== optionIndex)
                : [...currentAnswers, optionIndex];
            onAnswerChange(currentQuestion.id, newAnswers);
        }
    };

    const isOptionSelected = (optionIndex: number): boolean => {
        if (currentQuestion?.type === 'single') {
            return currentAnswer === optionIndex;
        } else {
            return Array.isArray(currentAnswer) && currentAnswer.includes(optionIndex);
        }
    };

    const canProceed = (): boolean => {
        if (!currentQuestion) return false;

        if (currentQuestion.type === 'single') {
            return currentAnswer !== undefined && currentAnswer !== null;
        } else {
            return Array.isArray(currentAnswer) && currentAnswer.length > 0;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Passage Section */}
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Read the magazine article about an underground market and answer the best answer for each
                        question.
                    </h2>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                        {passage.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white rounded-lg shadow-lg flex flex-col max-h-[80vh]">
                <div className="p-6 flex-1 overflow-y-auto">
                    {currentQuestion && (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {currentQuestion.question}
                                </h3>

                                {currentQuestion.type === 'multiple' && (
                                    <p className="text-sm text-blue-600 mb-4">
                                        Select all that apply
                                    </p>
                                )}
                            </div>

                            {/* Answer Options - Fixed spacing */}
                            <div className="space-y-2">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = isOptionSelected(index);

                                    return (
                                        <label
                                            key={index}
                                            className={`
                                            flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                                        `}
                                        >
                                            <input
                                                type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                                                name={currentQuestion.type === 'single' ? 'question-option' : undefined}
                                                checked={isSelected}
                                                onChange={() => handleOptionSelect(index)}
                                                className="sr-only"
                                            />

                                            {/* Fixed checkbox/radio styling */}
                                            <div className={`
                                            flex-shrink-0 mr-3 border-2 flex items-center justify-center transition-all duration-200
                                            ${currentQuestion.type === 'single'
                                                ? 'w-4 h-4 rounded-full'
                                                : 'w-4 h-4 rounded'
                                            }
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                            }
                                        `}>
                                                {isSelected && (
                                                    currentQuestion.type === 'single' ? (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white"/>
                                                    ) : (
                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor"
                                                             viewBox="0 0 20 20">
                                                            <path fillRule="evenodd"
                                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    )
                                                )}
                                            </div>

                                            <span className="text-gray-900 text-sm leading-relaxed">
                                            {option}
                                        </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation Footer - Fixed positioning */}
                <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        {showPrevious && onPrevious ? (
                            <button
                                onClick={onPrevious}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2"/>
                                Previous
                            </button>
                        ) : (
                            <div/>
                        )}

                        <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                            {currentQuestionIndex + 1} of {questions.length}
                        </span>
                            <button
                                onClick={onNextAction}
                                disabled={!canProceed()}
                                className={`
                                inline-flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${canProceed()
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                                <ChevronRight className="w-4 h-4 ml-2"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadingPassage;