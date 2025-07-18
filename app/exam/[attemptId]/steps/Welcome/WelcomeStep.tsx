import {useTimerStore} from "@/state/timerStore";
import {useUserStore} from "@/state/userStore";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function WelcomeStep({html, onNextAction}: { html: string; onNextAction: () => void }) {
    const start = useTimerStore(s => s.start);
    const isRunning = useTimerStore(s => s.isRunning);
    const {user} = useUserStore();
    const router = useRouter();

    const handleStart = () => {
        if (!isRunning) start();
        onNextAction();
    };

    useEffect(() => {
        if(!user) {
            router.push("/")
        }
    }, [router, user]);


    return (
        <>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}}/>
            <button className="btn mt-6" onClick={handleStart}>Start</button>
        </>
    );
}
