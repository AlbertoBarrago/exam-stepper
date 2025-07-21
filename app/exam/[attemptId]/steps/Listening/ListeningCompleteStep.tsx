'use client';

import SectionComplete from "@/components/Final";

type Props = { title: string, onNextAction: () => void };

export default function ListeningCompleteStep({onNextAction}: Props) {

    const handleNext = () => {
        onNextAction();
    }

    return (
        <SectionComplete
            completedSection="listening"
            nextSection="writing"
            onContinue={handleNext}
        />
    );
}