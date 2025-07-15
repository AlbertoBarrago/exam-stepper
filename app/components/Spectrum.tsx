'use client';
import { useEffect, useRef } from 'react';

export default function Spectrum({ stream }: { stream: MediaStream | null }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!stream) return;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        const buffer = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current!;
        const c2d = canvas.getContext('2d')!;

        const draw = () => {
            analyser.getByteFrequencyData(buffer);
            c2d.clearRect(0, 0, canvas.width, canvas.height);
            buffer.forEach((v, i) => {
                const barH = (v / 255) * canvas.height;
                c2d.fillRect(i * 3, canvas.height - barH, 2, barH);
            });
            requestAnimationFrame(draw);
        };
        draw();
    }, [stream]);

    return <canvas ref={canvasRef} className="w-full h-24 bg-black" />;
}
