'use client';

import SectionComplete from "@/components/Final";

type Props = { onNextAction: () => void };

export default function SpeakingCompleteStep({onNextAction}: Props) {

    const handleNext = () => {
        onNextAction();
    }

    return (
        <SectionComplete
            completedSection="speaking"
            nextSection={null}
            onContinue={handleNext}
        />
    );
}