'use client';
import WelcomeStep from "@/exam/[attemptId]/steps/Welcome/WelcomeStep";
import ReadingIntroStep from "@/exam/[attemptId]/steps/Reading/ReadingIntroStep";
import ReadingQuestionStep from "@/exam/[attemptId]/steps/Reading/ReadingQuestionStep";
import ReadingCompleteStep from "@/exam/[attemptId]/steps/Reading/ReadingCompleteStep";
import ListeningIntroStep from "@/exam/[attemptId]/steps/Listening/ListeningIntroStep";
import ListeningStep from "@/exam/[attemptId]/steps/Listening/ListeningStep";
import ListeningCompleteStep from "@/exam/[attemptId]/steps/Listening/ListeningCompleteStep";
import WritingIntroStep from "@/exam/[attemptId]/steps/Writing/WritingIntroStep";
import WritingStep from "@/exam/[attemptId]/steps/Writing/WritingStep";
import WritingCompleteStep from "@/exam/[attemptId]/steps/Writing/WritingCompleteStep";
import SpeakingIntroStep from "@/exam/[attemptId]/steps/Speaking/SpeakingIntroStep";
import SpeakingStep from "@/exam/[attemptId]/steps/Speaking/SpeakingStep";
import FinalRecapStep from "@/exam/[attemptId]/steps/Final/FinalRecapStep";
import {JSX, useEffect} from "react";
import {useTimerStore} from "@/state/timerStore";
import PreventBackNavigation from "@/components/PreventBackNavigation";
import PermissionStep from "@/exam/[attemptId]/steps/Permission/PermissionStep";
import SpeakingCompleteStep from "@/exam/[attemptId]/steps/Speaking/SpeakingCompleteStep";
import {useStepStore} from "@/state/stepStore";
import ReadingQuestionListStep from "@/exam/[attemptId]/steps/Reading/ReadingQuestionListStep";

function StepBody({current, next}: { current: number; next: () => void }) {
    const steps = useStepStore(s => s.steps);
    const step = steps[current];

    if (!step) {
        return <div>Loading step...</div>;
    }

    switch (step.kind) {
        case 'welcome':
            return <WelcomeStep onNextAction={next}/>;
        case 'permission':
            return <PermissionStep onNextAction={next}/>;
        case 'reading-intro':
            return <ReadingIntroStep title={step.title} subtitle={step.subTitle} onNextAction={next}/>;
        case 'reading-question':
            return <ReadingQuestionStep sentence={step.sentence} onNextAction={next}/>;
        case 'reading-question-list':
            return <ReadingQuestionListStep questions={step.questions} passage={step.passage} onNextAction={next}/>;
        case 'reading-complete':
            return <ReadingCompleteStep title={step.title} onNextAction={next}/>;
        case 'listening-intro':
            return <ListeningIntroStep title={step.title} onNextAction={next}/>;
        case 'listening-question':
            return <ListeningStep audioUrl={step.audioUrl} questions={step.questions} onNextAction={next}/>;
        case 'listening-complete':
            return <ListeningCompleteStep title={step.title} onNextAction={next}/>;
        case 'writing-intro':
            return <WritingIntroStep title={step.title} onNextAction={next}/>;
        case 'writing-question':
            return <WritingStep title={step.title} onNextAction={next}/>;
        case 'writing-complete':
            return <WritingCompleteStep title={step.title} onNextAction={next}/>;
        case 'speaking-intro':
            return <SpeakingIntroStep title={step.title} onNextAction={next}/>;
        case 'speaking-question':
            return <SpeakingStep durationMs={step.durationMs} onNextAction={next}/>;
        case 'speaking-complete':
            return <SpeakingCompleteStep onNextAction={next}/>;
        case 'final':
            return <FinalRecapStep/>;
        default:
            return <div>Invalid step</div>;
    }
}

export default function Main(): JSX.Element {
    const currentStepIndex = useTimerStore(s => s.currentStepIndex);
    const nextStep = useTimerStore(s => s.nextStep);
    const {steps, isLoading, error, fetchSteps} = useStepStore();

    useEffect(() => {
        if (steps.length === 0) {
            void fetchSteps();
        }
    }, [fetchSteps, steps.length]);

    if (isLoading) {
        return <div className="text-center p-10">Loading Exam...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600">Error: {error}</div>;
    }

    return (
        <>
            <PreventBackNavigation/>
            <section className="p-6 text-center">
                <StepBody current={currentStepIndex} next={nextStep}/>
            </section>
        </>
    );
}