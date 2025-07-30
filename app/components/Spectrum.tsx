'use client';

import { useEffect, useRef } from 'react';

export default function Spectrum({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = 120;
      }
    };

    window.addEventListener('resize', handleResize);
    const audioCtx = new AudioContext();
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;

    src.connect(analyser);

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 120;

    const draw = () => {
      analyser.getByteFrequencyData(buffer);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const barCount = 2048;
      const barWidth = 1;
      const barSpacing = 1;
      const totalBarWidth = barWidth + barSpacing;

      for (let i = 0; i < barCount; i++) {
        const value = buffer[i] || 0;
        const barHeight = (value / 255) * centerY;

        const rightX = centerX + i * totalBarWidth + barSpacing;
        const leftX = centerX - i * totalBarWidth - barWidth - barSpacing;

        ctx.fillStyle = '#3bbf2b';

        ctx.fillRect(rightX, centerY - barHeight, barWidth, barHeight);
        ctx.fillRect(rightX, centerY, barWidth, barHeight);

        if (i > 0) {
          ctx.fillRect(leftX, centerY - barHeight, barWidth, barHeight);
          ctx.fillRect(leftX, centerY, barWidth, barHeight);
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    audioCtx.resume().then(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      void audioCtx.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      className="h-[80px] w-full pointer-events-none z-10"
      style={{ backgroundColor: 'transparent' }}
    />
  );
}
