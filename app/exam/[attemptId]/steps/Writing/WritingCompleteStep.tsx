'use client';

import SectionComplete from "@/components/step/Final";

type Props = { title: string, onNextAction: () => void };


export default function WritingCompleteStep({onNextAction}: Props) {

    const handleNext = () => {
        onNextAction();
    }

    return (
        <SectionComplete
            completedSection="writing"
            nextSection="speaking"
            onContinue={handleNext}
        />
    );
}