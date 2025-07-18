import {useTimerStore} from "@/lib/timerStore";

export default function WelcomeStep({html, onNextAction}: { html: string; onNextAction: () => void }) {
    const start = useTimerStore(s => s.start);
    const isRunning = useTimerStore(s => s.isRunning);


    const handleStart = () => {
        if (!isRunning) start();
        onNextAction();
    };


    return (
        <>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}}/>
            <button className="btn mt-6" onClick={handleStart}>Start</button>
        </>
    );
}
