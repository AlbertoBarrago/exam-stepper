import {useTimerStore} from "@/state/timerStore";
import WelcomeComponent from "@/components/Welcome";

export default function WelcomeStep({onNextAction}: { onNextAction: () => void }) {
    const start = useTimerStore(s => s.start);

    const handleStart = () => {
        start(); //Start the process
        onNextAction();
    };


    return (
        <WelcomeComponent
            onNextAction={handleStart}
            title="Welcome"
            subtitle="You are about to start the test"
        />
    );
}
