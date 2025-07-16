'use client';

import { useEffect, useState } from 'react';
import { useExam } from './ExamProvider';
import { Clock } from 'lucide-react';

const TOTAL_MS = 50 * 60 * 1000;

export default function GlobalProgressBar() {
    const { remaining } = useExam();
    const pct = Math.max(0, (remaining / TOTAL_MS) * 100);
    const [formatted, setFormatted] = useState(formatTime(remaining));

    useEffect(() => {
        setFormatted(formatTime(remaining));
    }, [remaining]);

    return (
        <div className="fixed top-0 left-0 w-full h-3 z-50 flex items-center bg-gray-200">
            <div className="relative h-full w-[95%]">
                <div
                    className="absolute top-0 left-0 h-full bg-blue-600 transition-[width] duration-100"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="w-[5%] h-full flex items-center justify-center text-xs gap-1 text-gray-700 bg-gray-100">
                <Clock size={12} className="text-gray-500" />
                <span className="font-mono">{formatted}</span>
            </div>
        </div>
    );
}

function formatTime(ms: number) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}