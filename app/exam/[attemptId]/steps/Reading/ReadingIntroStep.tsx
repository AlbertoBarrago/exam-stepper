import IntroComponent from "@/components/step/Intro";
import {IntroProps} from "@/types/introTypes";


export default function ReadingIntroStep({title, subtitle, kind, durationMs, onNextAction}: IntroProps) {

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