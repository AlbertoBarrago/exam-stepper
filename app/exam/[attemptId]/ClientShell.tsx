'use client';
import {StepsConfig} from '@/const/stepsConfig';
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
import Stepper from "@/components/Stepper";
import {JSX, useState} from "react";

function StepBody({current, next}: { current: number; next: () => void }) {
    const step = StepsConfig[current];
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
        case 'writing-intro':
            return (
                <WritingIntroStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'writing-question':
            return (
                <WritingStep
                    title={step.title}
                    onNextAction={() => next()}
                />
            );
        case 'writing-complete':
            return (
                <WritingCompleteStep
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
            return (
                <FinalRecapStep/>
            );
        default:
            return <div>Invalid step</div>;
    }
}


export default function ClientShell(): JSX.Element {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent(c => Math.min(c + 1, StepsConfig.length - 1));

    return (
        <section className="max-w-xl mx-auto p-6">
            <Stepper total={StepsConfig.length} current={current}/>
            <h2 className="text-lg font-semibold mb-4">{StepsConfig[current].title}</h2>
            <StepBody current={current} next={next}/>
        </section>
    );
}