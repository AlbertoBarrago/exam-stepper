import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ReadingQuestionProps {
    questionNumber?: number;
    totalQuestions?: number;
    sentence: string;
    options?: string[];
    onNextAction?: (selectedAnswer: number) => void;
    onAnswerChangeAction?: (optionIndex: number) => void;
    initialAnswer?: number | null;
}

const ReadingQuestion: React.FC<ReadingQuestionProps> = ({
                                                             questionNumber = 1,
                                                             totalQuestions = 10,
                                                             sentence = "James has considerable _____ about advertising.",
                                                             options = ["information", "knowledge", "communication", "intelligence"],
                                                             onNextAction,
                                                             onAnswerChangeAction,
                                                             initialAnswer = null
                                                         }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(initialAnswer);

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedAnswer(optionIndex);
        if (onAnswerChangeAction) {
            onAnswerChangeAction(optionIndex);
        }
    };

    const handleNext = () => {
        if (onNextAction && selectedAnswer !== null) {
            onNextAction(selectedAnswer);
        }
    };

    return (
        <div className=" flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-lg font-medium text-gray-900 mb-2">
                        You will read {totalQuestions} sentences.
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Choose the best word or phrase that best completes each sentence.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <p className="text-gray-900 text-center leading-relaxed">
                            {sentence}
                        </p>
                    </div>

                    <div className="space-y-3" role="radiogroup" aria-labelledby="question-text">
                        {options.map((option, index) => (
                            <label
                                key={index}
                                className={`
                  flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedAnswer === index
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                `}
                                htmlFor={`option-${index}`}
                            >
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name="question-option"
                                    value={index}
                                    checked={selectedAnswer === index}
                                    onChange={() => handleOptionSelect(index)}
                                    className="sr-only"
                                    aria-describedby={`option-${index}-label`}
                                />
                                <div className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center
                  ${selectedAnswer === index
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }
                `}>
                                    {selectedAnswer === index && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                                <span
                                    id={`option-${index}-label`}
                                    className="text-gray-900 font-medium"
                                >
                  {option}
                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="text-center mb-6">
                    <button
                        onClick={handleNext}
                        disabled={selectedAnswer === null}
                        className={`
              inline-flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer
              ${selectedAnswer !== null
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


                <div id="question-text" className="sr-only">
                    Question {questionNumber} of {totalQuestions}: Complete the sentence by choosing the best option
                </div>
                <div id="next-button-help" className="sr-only">
                    {selectedAnswer === null
                        ? "Please select an answer before proceeding"
                        : "Continue to next question"
                    }
                </div>
            </div>
        </div>
    );
};

export default ReadingQuestion;