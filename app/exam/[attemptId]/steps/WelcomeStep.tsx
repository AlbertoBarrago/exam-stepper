import {useExam} from "@/providers/ExamProvider";

export default function WelcomeStep({html, onNext}: { html: string; onNext: () => void }) {
    const {startExam, running} = useExam();

    const handleStart = () => {
        if (!running) startExam();
        onNext();
    };


    return (
        <>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}}/>
            <button className="btn mt-6" onClick={handleStart}>Start</button>
        </>
    );
}
