import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: string[];
    type: 'single' | 'multiple';
}

interface ReadingPassageProps {
    passage: string;
    questions: Question[];
    currentQuestionIndex?: number;
    onAnswerChange: (questionId: string, answer: number | number[]) => void;
    onNextAction: () => void;
    onPrevious?: () => void;
    answers: Record<string, number | number[]>;
    showPrevious?: boolean;
}

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
        <div className="p-4">
            <div className="mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-2rem)]">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 h-full overflow-y-auto">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Read the magazine article about an underground market and answer the best answer for each question.
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

                    <div className="bg-white rounded-lg shadow-lg flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            {currentQuestion && (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            {currentQuestion.question}
                                        </h3>

                                        {currentQuestion.type === 'multiple' && (
                                            <p className="text-sm text-blue-600 mb-4">
                                                Select all that apply
                                            </p>
                                        )}
                                    </div>

                                    {/* Answer Options */}
                                    <div className="space-y-3" role={currentQuestion.type === 'single' ? 'radiogroup' : 'group'}>
                                        {currentQuestion.options.map((option, index) => {
                                            const isSelected = isOptionSelected(index);

                                            return (
                                                <label
                                                    key={index}
                                                    className={`
                            flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
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
                                                        aria-describedby={`option-${index}-label`}
                                                    />

                                                    <div className={`
                            flex-shrink-0 mt-0.5 mr-3 border-2 flex items-center justify-center transition-all duration-200
                            ${currentQuestion.type === 'single'
                                                        ? 'w-5 h-5 rounded-full'
                                                        : 'w-5 h-5 rounded'
                                                    }
                            ${isSelected
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                    }
                          `}>
                                                        {isSelected && (
                                                            currentQuestion.type === 'single' ? (
                                                                <div className="w-2 h-2 rounded-full bg-white" />
                                                            ) : (
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )
                                                        )}
                                                    </div>

                                                    <span
                                                        id={`option-${index}-label`}
                                                        className="text-gray-900 text-sm leading-relaxed"
                                                    >
                            {option}
                          </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Navigation Footer */}
                        <div className="border-t border-gray-200 p-6 bg-gray-50">
                            <div className="flex justify-between items-center">
                                {showPrevious && onPrevious ? (
                                    <button
                                        onClick={onPrevious}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                                        Previous
                                    </button>
                                ) : (
                                    <div />
                                )}

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
                                    aria-describedby="next-button-help"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div id="next-button-help" className="sr-only">
                    {!canProceed()
                        ? "Please select an answer before proceeding"
                        : "Continue to next question"
                    }
                </div>
            </div>
        </div>
    );
};

export default ReadingPassage;