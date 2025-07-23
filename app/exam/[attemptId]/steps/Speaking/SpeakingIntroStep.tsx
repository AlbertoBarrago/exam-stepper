import IntroComponent from "@/components/step/Intro";
import {IntroProps} from "@/types/introTypes";


export default function SpeakingIntroStep({title, subtitle, durationMs, kind, onNextAction}: IntroProps) {

    const handleNext = () => {
        onNextAction();
    }

    return (
        <IntroComponent
            onStartAction={handleNext}
            duration={durationMs}
            title={title}
            subtitle={subtitle}
            kind={kind}
        />
    );
}