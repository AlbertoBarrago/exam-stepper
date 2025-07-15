import { useEffect, useRef, useState } from 'react';

export function useTimer(durationMs: number, onExpire: () => void) {
    const start = useRef(performance.now());
    const [remaining, setRemaining] = useState(durationMs);

    useEffect(() => {
        let raf: number;
        const tick = () => {
            const delta = performance.now() - start.current;
            const timeLeft = durationMs - delta;
            setRemaining(Math.max(0, timeLeft));
            if (timeLeft > 0) raf = requestAnimationFrame(tick);
            else onExpire();
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [durationMs, onExpire]);

    return remaining;
}
