import React, { useState, useRef, useEffect } from 'react';

interface WritingTaskProps {
    title?: string;
    subtitle?: string;
    placeholder?: string;
    minWords?: number;
    maxWords?: number;
    onTextChange?: (text: string, wordCount: number) => void;
    onSubmit: (text: string) => void;
    initialText?: string;
    buttonText?: string;
}

const WritingTask: React.FC<WritingTaskProps> = ({
                                                     title = "Write a clear and compelling job advertisement.",
                                                     subtitle,
                                                     placeholder = "Start your answer here...",
                                                     minWords = 0,
                                                     maxWords = 150,
                                                     onTextChange,
                                                     onSubmit,
                                                     initialText = "",
                                                     buttonText = "Submit"
                                                 }) => {
    const [text, setText] = useState(initialText);
    const [wordCount, setWordCount] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Count words function
    const countWords = (text: string): number => {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    };

    // Handle text change
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        const newWordCount = countWords(newText);

        // Prevent exceeding max word limit
        if (maxWords && newWordCount > maxWords) {
            return;
        }

        setText(newText);
        setWordCount(newWordCount);

        if (onTextChange) {
            onTextChange(newText, newWordCount);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    // Initialize word count
    useEffect(() => {
        const initialWordCount = countWords(initialText);
        setWordCount(initialWordCount);
    }, [initialText]);

    const handleSubmit = () => {
        onSubmit(text);
    };

    const canSubmit = () => {
        return wordCount >= minWords && wordCount <= maxWords && text.trim().length > 0;
    };

    const getWordCountColor = () => {
        if (wordCount === 0) return 'text-gray-500';
        if (wordCount < minWords) return 'text-orange-500';
        if (wordCount > maxWords * 0.9) return 'text-red-500';
        return 'text-green-600';
    };

    const getWordCountMessage = () => {
        if (wordCount === 0) return `Target: ${maxWords} words`;
        if (wordCount < minWords) return `Need ${minWords - wordCount} more words`;
        if (wordCount === maxWords) return 'Maximum reached';
        return `${maxWords - wordCount} words remaining`;
    };

    return (
        <div className="flex items-center justify-center p-4 mt-10">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-600 text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Writing Area */}
                <div className="mb-6">
                    <div className="relative">
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                placeholder={placeholder}
                className="w-full min-h-[300px] p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                aria-describedby="word-count writing-instructions"
                aria-label="Writing task response"
            />

                        {/* Word Counter */}
                        <div className="absolute bottom-4 right-4 flex flex-col items-end">
                            <div
                                id="word-count"
                                className={`text-sm font-medium ${getWordCountColor()}`}
                                aria-live="polite"
                                aria-label={`Word count: ${wordCount} of ${maxWords}`}
                            >
                                {wordCount}/{maxWords}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {getWordCountMessage()}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    wordCount < minWords
                                        ? 'bg-orange-400'
                                        : wordCount > maxWords * 0.9
                                            ? 'bg-red-400'
                                            : 'bg-green-500'
                                }`}
                                style={{
                                    width: `${Math.min((wordCount / maxWords) * 100, 100)}%`
                                }}
                                role="progressbar"
                                aria-valuenow={wordCount}
                                aria-valuemin={0}
                                aria-valuemax={maxWords}
                                aria-label={`Writing progress: ${wordCount} of ${maxWords} words`}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit()}
                        className={`
              px-8 py-3 rounded-lg font-medium transition-all duration-200
              ${canSubmit()
                            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
            `}
                        aria-describedby="submit-help"
                    >
                        {buttonText}
                    </button>
                </div>

                {/* Screen reader instructions */}
                <div id="writing-instructions" className="sr-only">
                    Writing task with {maxWords} word limit.
                    {minWords > 0 && `Minimum ${minWords} words required.`}
                    Use the text area to write your response. Word count is displayed and updated as you type.
                </div>

                <div id="submit-help" className="sr-only">
                    {!canSubmit()
                        ? `Cannot submit: ${wordCount < minWords ? 'need more words' : wordCount > maxWords ? 'too many words' : 'please write something'}`
                        : 'Ready to submit your response'
                    }
                </div>
            </div>
        </div>
    );
};

export default WritingTask;