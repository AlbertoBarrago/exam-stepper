import React from 'react';
import {BookOpenIcon, PencilIcon, SpeakerIcon, MicIcon} from "lucide-react";


const WelcomeComponent = ({
                              onNextAction: onNextAction = () => {},
                              title = "Welcome",
                              subtitle = "You are about to start the test"
                          }) => {
    const testSections = [
        {
            icon: BookOpenIcon,
            name: "Reading",
            duration: "30 mins",
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            icon: SpeakerIcon,
            name: "Listening",
            duration: "30 mins",
            color: "text-gray-500",
            bgColor: "bg-gray-50"
        },
        {
            icon: PencilIcon,
            name: "Writing",
            duration: "60 mins",
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            icon: MicIcon,
            name: "Speaking",
            duration: "15 mins",
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        }
    ];

    const instructions = [
        "Check you will have enough time to complete the whole test before you begin. Once you begin the test, you cannot pause the timer or restart the test. You can take very short breaks between test sections if needed. These breaks are also timed.",
        "You can only take the test once. You cannot repeat the test to practice.",
        "If your internet connection isn't stable, you may not be able to complete the test. Portal tests are not saved.",
        "You will not lose points for wrong answers.",
        "Once you submit an exercise, you cannot go back."
    ];

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {testSections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <div
                                key={index}
                                className="text-center p-4"
                                role="listitem"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 ${section.bgColor} rounded-full mb-3`}>
                                    <IconComponent
                                        className={`w-6 h-6 ${section.color}`}
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">
                                    {section.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {section.duration}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mb-8 space-y-4" role="list" aria-label="Test instructions">
                    {instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start" role="listitem">
                            <div
                                className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"
                                aria-hidden="true"
                            />
                            <p className="text-sm text-gray-700 leading-relaxed text-left">
                                {instruction}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={onNextAction}
                        className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg px-8 py-3 transition-colors duration-200 cursor-pointer"
                        aria-describedby="test-overview"
                    >
                        Next
                    </button>
                </div>

                <div id="test-overview" className="sr-only">
                    Test overview: This test contains 4 sections - Reading (30 minutes),
                    Listening (30 minutes), Writing (60 minutes), and Speaking (15 minutes).
                    Total duration approximately 2 hours and 15 minutes. Please review all
                    instructions before proceeding.
                </div>
            </div>
        </div>
    );
};

export default WelcomeComponent;