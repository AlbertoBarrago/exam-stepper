'use client';
import { StepsConst } from '@/const/stepsConst';
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
import SectionTimerBar from "@/components/SectionTimeBar";
import { useEffect, useRef, useState } from "react";
import { useTimerStore } from "@/state/timerStore";
import {Section} from "@/types/clientShellTypes";
import {QUESTION_KINDS, SECTIONS, stepKindToSection} from "@/const/clientShellConst";

function isSection(val: string | null): val is Section {
    return !!val && SECTIONS.includes(val as Section);
}

function StepBody({ current, next }: { current: number; next: () => void }) {
    const step = StepsConst[current];
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
                <FinalRecapStep />
            );
        default:
            return <div>Invalid step</div>;
    }
}

function TickController() {
    const tick = useTimerStore(s => s.tick);
    const isRunning = useTimerStore(s => s.isRunning);
    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => tick(), 1000);
        return () => clearInterval(interval);
    }, [isRunning, tick]);
    return null;
}

export default function ClientShell() {
    const [current, setCurrent] = useState(0);
    const step = StepsConst[current];
    const section = stepKindToSection(step.kind);

    const prevStepKindRef = useRef<string | null>(null);
    const startSection = useTimerStore(s => s.startSection);
    const pause = useTimerStore(s => s.pause);

    useEffect(() => {
        const step = StepsConst[current];
        const currentKind = step.kind;
        const prevKind = prevStepKindRef.current;
        const thisSection = stepKindToSection(currentKind);

        if (QUESTION_KINDS.includes(currentKind)) {
            if (
                prevKind &&
                stepKindToSection(prevKind) === thisSection &&
                prevKind.endsWith('-intro') &&
                isSection(thisSection)
            ) {
                startSection(thisSection);
            }
        }
        else if (currentKind.endsWith('-complete')) {
            pause();
        }

        prevStepKindRef.current = currentKind;
    }, [current, startSection, pause]);


    const next = () => setCurrent(c => Math.min(c + 1, StepsConst.length - 1));

    return (
        <>
            <SectionTimerBar displaySection={isSection(section) ? section : null} />
            <TickController />
            <main className="max-w-xl mx-auto p-6">
                <Stepper total={StepsConst.length} current={current} />
                <h2 className="text-lg font-semibold mb-4">{StepsConst[current].title}</h2>
                <StepBody current={current} next={next} />
            </main>
        </>
    );
}