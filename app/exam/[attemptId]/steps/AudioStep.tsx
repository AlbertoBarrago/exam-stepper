'use client';
import { useRef, useState } from 'react';
import CircularAudioPlayer from "@/components/CircularAudioPlayer";

export default function AudioStep({
                                      audioUrl,
                                      onNextAction
                                  }: {
    audioUrl: string;
    onNextAction: () => void;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playCount, setPlayCount] = useState(0);

    const handlePlay = () => {
        if (playCount < 2) {
            audioRef.current?.play().then(() => {
                setPlayCount(c => c + 1);
            });
        }
    };

    return (
        <div>
            <CircularAudioPlayer src={audioUrl}/>
            {/*<button*/}
            {/*    className="btn mt-6"*/}
            {/*    onClick={handlePlay}*/}
            {/*    disabled={playCount >= 2}*/}
            {/*>*/}
            {/*    {playCount < 2 ? 'Play Audio' : 'No more plays'}*/}
            {/*</button>*/}
            <button
                className="btn mt-6 ml-4"
                onClick={onNextAction}
            >
                Next →
            </button>
        </div>
    );
}