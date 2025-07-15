'use client';
import {JSX, useState} from 'react';
import { STEPS } from '@/lib/steps';
import Stepper from '@/components/Stepper';
import WelcomeStep from './steps/WelcomeStep';
import AudioStep from './steps/AudioStep';
import FillBlankStep from './steps/FillBlankStep';
import SpeakingStep from './steps/SpeakingStep';

export default function ClientShell() {
    const [index, setIndex] = useState(0);
    const step = STEPS[index];

    const next = () => setIndex(i => Math.min(STEPS.length - 1, i + 1));

    let body: JSX.Element;
    switch (step.kind) {
        case 'welcome':
            body = <WelcomeStep html={step.html} onNext={next} />;
            break;

        case 'audio':
            body = (
                <AudioStep
                    audioUrl={step.audioUrl}
                    durationMs={step.durationMs}
                    onNext={next}
                />
            );
            break;

        case 'fill':
            body = (
                <FillBlankStep
                    html={step.html}
                    answer={step.answer}
                    onNext={() => next()}
                />
            );
            break;

        case 'speak':
            body = (
                <SpeakingStep
                    durationMs={step.durationMs}
                    onNext={() => next()}
                />
            );
            break;
    }

    return (
        <main className="max-w-xl mx-auto p-6">
            <Stepper total={STEPS.length} current={index} />
            <h2 className="text-lg font-semibold mb-4">{step.title}</h2>
            {body}
        </main>
    );
}
