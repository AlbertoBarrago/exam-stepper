'use client';
import {STEPS} from '@/lib/steps';
import ExamProvider, {useExam} from '@/components/ExamProvider';
import WelcomeStep from "@/exam/[attemptId]/steps/WelcomeStep";
import AudioStep from "@/exam/[attemptId]/steps/AudioStep";
import SpeakingStep from "@/exam/[attemptId]/steps/SpeakingStep";
import GlobalProgressBar from "@/components/GlobalProgressBar";
import ChoiceStep from "@/exam/[attemptId]/steps/ChoiceStep";

function StepBody() {
    const {current, next} = useExam();
    const step = STEPS[current];

    switch (step.kind) {
        case 'welcome':
            return <WelcomeStep html={step.html}
                                onNext={() => next()}/>;
        case 'audio':
            return (
                <AudioStep
                    audioUrl={step.audioUrl}
                    onNextAction={() => next()}
                />
            );
        case 'choice':
            return (
                <ChoiceStep
                    sentence={step.sentence}
                    options={step.options}
                    correct={step.correct}
                    onNextAction={() => next()}
                />
            );
        case 'speak':
            return (
                <SpeakingStep
                    durationMs={step.durationMs}
                    onNextAction={(blob: Blob) => next()}
                />
            );
    }
}

export default function ClientShell() {
    return (
        <ExamProvider
            stepsCount={STEPS.length}
            onFinishAction={() => alert('Time is up!')}
        >
            <GlobalProgressBar/>
            <MainExamUI/>
        </ExamProvider>
    );
}

function MainExamUI() {
    const {current} = useExam();

    return (
        <main className="max-w-xl mx-auto p-6">
            {/*<Stepper total={STEPS.length} current={current} />*/}
            <h2 className="text-lg font-semibold mb-4">{STEPS[current].title}</h2>
            <StepBody/>
        </main>
    );
}
