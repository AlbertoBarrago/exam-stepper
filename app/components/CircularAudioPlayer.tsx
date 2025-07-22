import React, {useRef, useState, useEffect} from "react";
import {Play, Pause} from "lucide-react";

interface CircularAudioPlayerProps {
    src: string | null;
    duration?: number;
    permissionStep?: boolean;
    limitPlays?: boolean;
}

export default function CircularAudioPlayer({
                                                src,
                                                duration,
                                                permissionStep,
                                                limitPlays = true,
                                            }: CircularAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(duration || 1);
    const [playCount, setPlayCount] = useState(0);

    useEffect(() => {
        if (!isPlaying) setProgress(0);
    }, [isPlaying, src]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (!audio.duration) return;
            setProgress(audio.currentTime / audio.duration);
        };

        const setMetaDuration = () => setAudioDuration(audio.duration || duration || 1);

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", setMetaDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", setMetaDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [duration, src]);

    const handlePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!permissionStep && limitPlays && playCount >= 2) return;

        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
        setPlayCount(count => count + 1);
        setProgress(0);
    };

    const handlePause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setIsPlaying(false);
    };

    const handleButtonClick = () => {
        if (isPlaying) {
            handlePause();
        } else {
            handlePlay();
        }
    };

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const displayProgress = progress;

    const isButtonDisabled = permissionStep
        ? false
        : (limitPlays && playCount >= 2 && !isPlaying);


    return (
        <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
            {src &&
                <audio ref={audioRef} src={src} preload="auto" style={{ display: "none" }} />
            }

            <button
                className="z-10 bg-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center focus:outline-none"
                onClick={handleButtonClick}
                aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                disabled={isButtonDisabled}
                style={{
                    opacity: isButtonDisabled ? 0.6 : 1,
                    cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
                }}
            >
                {isPlaying
                    ? <Pause size={40} strokeWidth={2} className="text-blue-600" />
                    : <Play size={40} strokeWidth={2} className="text-blue-600" />}
            </button>

            <svg
                className="absolute top-0 left-0"
                width={128}
                height={128}
            >
                <circle
                    cx={64}
                    cy={64}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={8}
                />
                <circle
                    cx={64}
                    cy={64}
                    r={radius}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={8}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - displayProgress * circumference}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.2s linear' }}
                />
            </svg>
        </div>
    );
}
