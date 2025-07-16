'use client';
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';

const TOTAL_MS = 50 * 60 * 1000;

type ExamCtx = {
    remaining: number;
    elapsed: number;
    next: () => void;
    current: number;
};

const Ctx = createContext<ExamCtx | null>(null);

export function useExam() {
    const c = useContext(Ctx);
    if (!c) throw new Error('useExam must be inside <ExamProvider>');
    return c;
}

export default function ExamProvider({
                                         children,
                                         stepsCount,
                                         onFinishAction
                                     }: {
    children: React.ReactNode;
    stepsCount: number;
    onFinishAction: () => void;
}) {
    const [current, setCurrent] = useState(0);
    const next = () => setCurrent((i) => Math.min(i + 1, stepsCount - 1));

    const start = useRef<number>(performance.now());
    const [remaining, setRemaining] = useState(TOTAL_MS);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let raf: number;
        const tick = () => {
            const delta = performance.now() - start.current;
            const left = TOTAL_MS - delta;
            setRemaining(left);
            setElapsed(delta);
            if (left <= 0) onFinishAction();
            else raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [onFinishAction]);

    return (
        <Ctx.Provider value={{remaining, elapsed, next, current}}>
            {children}
        </Ctx.Provider>
    );
}
