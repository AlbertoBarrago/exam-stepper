'use client';

import ReadingComponent from "@/components/step/ReadingIntro";

type Props = { title: string, subtitle: string, onNextAction: () => void };

export default function ReadingIntroStep({title, subtitle, onNextAction}: Props) {

    const handleNext = () => {
        onNextAction();
    }

    return (
        <ReadingComponent
            onStartAction={handleNext}
            duration="20 mins"
            title={title}
            subtitle={subtitle}
        />
    );
}