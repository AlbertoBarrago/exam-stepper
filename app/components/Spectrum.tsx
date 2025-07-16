'use client';

import { useEffect, useRef } from 'react';

export default function Spectrum({ stream }: { stream: MediaStream | null }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!stream) return;

        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;

        src.connect(analyser);

        const buffer = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        canvas.width = window.innerWidth;
        canvas.height = 120;

        const draw = () => {
            analyser.getByteFrequencyData(buffer);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ECG-style line
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#22d3ee'; // cyan-400

            const sliceWidth = canvas.width / buffer.length;
            let x = 0;

            for (let i = 0; i < buffer.length; i++) {
                const v = buffer[i] / 255;
                const y = canvas.height - v * canvas.height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.stroke();
            requestAnimationFrame(draw);
        };

        audioCtx.resume().then(draw);

        return () => {
            audioCtx.close();
        };
    }, [stream]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-50 bottom-50 left-0 w-screen h-[120px] pointer-events-none z-10"
            style={{ backgroundColor: 'transparent' }}
        />
    );
}
