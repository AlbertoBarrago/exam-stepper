import {RefObject} from "react";

export type SpeakingTypes = {
    durationMs: number,
    onNextAction: (blob: Blob) => void,
    startRecording: () => void,
    stream : MediaStream | null,
    recording: boolean,
    done: boolean,
    audioURL: string | null,
    chunksRef: RefObject<Blob[]>,
    recorderRef: RefObject<MediaRecorder | null>
}

export type SpeakingStepTypes = {
    durationMs: number;
    onNextAction: (blob: Blob) => void;
};