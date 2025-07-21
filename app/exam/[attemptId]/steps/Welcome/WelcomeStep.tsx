import {useTimerStore} from "@/state/timerStore";

export default function WelcomeStep({html, onNextAction}: { html: string; onNextAction: () => void }) {
    const start = useTimerStore(s => s.start);

    const handleStart = () => {
        start()
        onNextAction();
    };


    return (
        <>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}}/>
            <button className="btn mt-6" onClick={handleStart}>Start</button>
        </>
    );
}
