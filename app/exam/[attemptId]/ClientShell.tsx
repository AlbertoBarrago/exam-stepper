'use client';
import {STEPS} from '@/lib/steps';
import ExamProvider, {useExam} from '@/providers/ExamProvider';
import WelcomeStep from "@/exam/[attemptId]/steps/WelcomeStep";
import AudioStep from "@/exam/[attemptId]/steps/AudioStep";
import SpeakingStep from "@/exam/[attemptId]/steps/SpeakingStep";
import GlobalProgressBar from "@/components/GlobalProgressBar";
import ChoiceStep from "@/exam/[attemptId]/steps/ChoiceStep";
import Stepper from "@/components/Stepper";
import FinalRecapStep from "@/exam/[attemptId]/steps/FinalRecap";

function StepBody() {
    const {current, next, elapsed} = useExam();
    const step = STEPS[current];

    switch (step.kind) {
        case 'welcome':
            return <WelcomeStep html={step.html}
                                onNext={() => next()}/>;
        case 'choice':
            return (
                <ChoiceStep
                    sentenceList={step.sentenceList}
                    onNextAction={() => next()}
                />
            );
        case 'audio':
            return (
                <AudioStep
                    audioUrl={step.audioUrl}
                    onNextAction={() => next()}
                    questions={step.questions}
                />
            );

        case 'speak':
            return (
                <SpeakingStep
                    durationMs={step.durationMs}
                    onNextAction={() => next()}
                />
            );
        case 'final':
            const totalMinutes = Math.round(elapsed / 60000);
            return (
                <FinalRecapStep
                    totalMinutes={totalMinutes}
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
            <Stepper total={STEPS.length} current={current}/>
            <h2 className="text-lg font-semibold mb-4">{STEPS[current].title}</h2>
            <StepBody/>
        </main>
    );
}
