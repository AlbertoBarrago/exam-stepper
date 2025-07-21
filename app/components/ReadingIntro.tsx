import React from 'react';
import {BookOpenIcon, ClockIcon} from "lucide-react";

const ReadingComponent = ({
                              onStartAction: onStart = () => {},
                              duration = "20 mins",
                              title = "Reading",
                              subtitle = "You are about to start the reading section."
                          }) => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {subtitle}
                    </p>
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <BookOpenIcon
                            className="w-8 h-8 text-blue-500"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">Reading</p>
                        <div className="flex items-center justify-center text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                            <span>{duration}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" aria-hidden="true"></div>
                        <p className="text-sm text-gray-700">
                            The questions in this test may get harder or easier to adapt to your
                            level. Use the progress bar to pace yourself so that you have time to
                            answer all the questions.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" aria-hidden="true"></div>
                        <p className="text-sm text-gray-700">
                            You will not lose points for incorrect answers.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" aria-hidden="true"></div>
                        <p className="text-sm text-gray-700">
                            Once you submit an exercise, you cannot go back.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg px-6 py-3 transition-colors duration-200 cursor-pointer"
                    aria-describedby="reading-instructions"
                >
                    Start
                </button>

                <div id="reading-instructions" className="sr-only">
                    Reading section with {duration} duration. Three important instructions:
                    Questions adapt to your level, no points lost for incorrect answers,
                    and submissions cannot be changed once submitted.
                </div>
            </div>
        </div>
    );
};

export default ReadingComponent;