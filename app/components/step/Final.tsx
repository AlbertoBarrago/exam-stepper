import React from 'react';
import {
    BookOpen,
    Headphones,
    PenTool,
    Mic,
    Check
} from 'lucide-react';

interface SectionCompleteProps {
    completedSection: 'reading' | 'listening' | 'writing' | 'speaking';
    nextSection?: 'listening' | 'writing' | 'speaking' | null;
    onContinue: () => void;
    customTitle?: string;
    customSubtitle?: string;
}

const SectionComplete: React.FC<SectionCompleteProps> = ({
                                                             completedSection,
                                                             nextSection,
                                                             onContinue,
                                                             customTitle = "Well done!",
                                                             customSubtitle
                                                         }) => {
    const sections = [
        {
            id: 'reading',
            name: 'Reading',
            duration: '20 mins',
            icon: BookOpen,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'listening',
            name: 'Listening',
            duration: '20 mins',
            icon: Headphones,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'writing',
            name: 'Writing',
            duration: '35 mins',
            icon: PenTool,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'speaking',
            name: 'Speaking',
            duration: '15 mins',
            icon: Mic,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        }
    ];

    const getSubtitle = () => {
        if (customSubtitle) return customSubtitle;

        if (!nextSection) {
            return "You have completed all sections of the test!";
        }

        const nextSectionName = sections.find(s => s.id === nextSection)?.name || 'next';
        return `You are about to start the ${nextSectionName.toLowerCase()} section.`;
    };

    const getButtonText = () => {
        return nextSection ? "Continue to the next section" : "View Results";
    };

    return (
        <div className="flex items-center justify-center p-4 mt-10">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {customTitle}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {getSubtitle()}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {sections.map((section) => {
                        const IconComponent = section.icon;
                        const isCompleted = sections.findIndex(s => s.id === completedSection) >= sections.findIndex(s => s.id === section.id);
                        const isCurrent = section.id === nextSection;

                        return (
                            <div
                                key={section.id}
                                className="text-center"
                                role="listitem"
                            >
                                <div className={`
                  relative inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300
                  ${isCompleted
                                    ? 'bg-slate-800 text-white'
                                    : isCurrent
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                }
                `}>
                                    {isCompleted && section.id !== nextSection ? (
                                        <Check className="w-8 h-8" aria-label="Completed"/>
                                    ) : (
                                        <IconComponent className="w-8 h-8" aria-hidden="true"/>
                                    )}
                                </div>
                                <h3 className={`
                  text-sm font-medium mb-1 transition-colors duration-300
                  ${isCompleted ? 'text-gray-900' : 'text-gray-500'}
                `}>
                                    {section.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {section.duration}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center">
                    <button
                        onClick={onContinue}
                        className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-full px-8 py-4 transition-all duration-200 min-w-[280px] cursor-pointer"
                        aria-describedby="continue-description"
                    >
                        {getButtonText()}
                    </button>
                </div>

                <div id="continue-description" className="sr-only">
                    {nextSection
                        ? `Continue to the ${sections.find(s => s.id === nextSection)?.name} section`
                        : "Continue to view your test results"
                    }
                </div>

                <div className="sr-only" aria-live="polite">
                    {completedSection.charAt(0).toUpperCase() + completedSection.slice(1)} section completed
                    successfully.
                    {nextSection
                        ? `Next: ${sections.find(s => s.id === nextSection)?.name} section.`
                        : "All sections completed."
                    }
                </div>
            </div>
        </div>
    );
};

export default SectionComplete;