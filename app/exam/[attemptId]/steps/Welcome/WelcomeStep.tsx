import {useExam} from "@/providers/ExamProvider";

export default function WelcomeStep({html, onNextAction}: { html: string; onNextAction: () => void }) {
    const {startExam, running} = useExam();

    const handleStart = () => {
        if (!running) startExam();
        onNextAction();
    };

    return (
        <>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}}/>
            <button className="btn mt-6" onClick={handleStart}>Start</button>
        </>
    );
}
