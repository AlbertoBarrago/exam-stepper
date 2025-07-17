'use client';
import { STEPS } from '@/lib/steps';
import ExamProvider, { useExam } from '@/providers/ExamProvider';
import WelcomeStep from "@/exam/[attemptId]/steps/Welcome/WelcomeStep";
import ReadingIntroStep from "@/exam/[attemptId]/steps/Reading/ReadingIntroStep";
import ReadingQuestionStep from "@/exam/[attemptId]/steps/Reading/ReadingQuestionStep";
import ReadingCompleteStep from "@/exam/[attemptId]/steps/Reading/ReadingCompleteStep";
import ListeningIntroStep from "@/exam/[attemptId]/steps/Listening/ListeningIntroStep";
import ListeningStep from "@/exam/[attemptId]/steps/Listening/ListeningStep";
import ListeningCompleteStep from "@/exam/[attemptId]/steps/Listening/ListeningCompleteStep";
import SpeakingIntroStep from "@/exam/[attemptId]/steps/Speaking/SpeakingIntroStep";
import SpeakingStep from "@/exam/[attemptId]/steps/Speaking/SpeakingStep";
import FinalRecapStep from "@/exam/[attemptId]/steps/Final/FinalRecapStep";
import GlobalProgressBar from "@/components/GlobalProgressBar";
import Stepper from "@/components/Stepper";

function StepBody() {
    const { current, next, elapsed } = useExam();
    const step = STEPS[current];

    switch (step.kind) {
        case 'welcome':
            return (
                <WelcomeStep
                    html={step.html}
                    onNextAction={() => next()}
                />
            );
        case 'reading-intro':
            return (
                <ReadingIntroStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'reading-question':
            return (
                <ReadingQuestionStep
                    sentenceList={step.sentenceList}
                    onNextAction={() => next()}
                />
            );
        case 'reading-complete':
            return (
                <ReadingCompleteStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'listening-intro':
            return (
                <ListeningIntroStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'listening-question':
            return (
                <ListeningStep
                    audioUrl={step.audioUrl}
                    questions={step.questions}
                    onNextAction={() => next()}
                />
            );
        case 'listening-complete':
            return (
                <ListeningCompleteStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'speaking-intro':
            return (
                <SpeakingIntroStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'speaking-question':
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
        default:
            return <div>Invalid step</div>;
    }
}

export default function ClientShell() {
    return (
        <ExamProvider
            stepsCount={STEPS.length}
            onFinishAction={() => alert('Time is up!')}
        >
            <GlobalProgressBar />
            <MainExamUI />
        </ExamProvider>
    );
}

function MainExamUI() {
    const { current } = useExam();

    return (
        <main className="max-w-xl mx-auto p-6">
            <Stepper total={STEPS.length} current={current}/>
            <h2 className="text-lg font-semibold mb-4">{STEPS[current].title}</h2>
            <StepBody />
        </main>
    );
}