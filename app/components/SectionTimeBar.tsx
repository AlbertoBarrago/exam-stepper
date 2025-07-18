'use client';
import { useTimerStore } from '@/state/timerStore';
import { SECTION_LIMITS } from '@/const/timesConst';
import { Book, Headphones, Pen, Mic } from 'lucide-react';
import { JSX } from "react";

type Section = keyof typeof SECTION_LIMITS;

type Props = {
    displaySection: Section | null;
};

const icons: Record<Section, JSX.Element> = {
    reading: <Book size={18} />,
    listening: <Headphones size={18} />,
    writing: <Pen size={18} />,
    speaking: <Mic size={18} />,
};

const names: Record<Section, string> = {
    reading: 'Reading',
    listening: 'Listening',
    writing: 'Writing',
    speaking: 'Speaking',
};

function formatTime(totalSec: number) {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function SectionTimeBar({ displaySection }: Props) {
    const currentSection = useTimerStore(s => s.currentSection);
    const sectionTimeLeft = useTimerStore(s => s.sectionTimeLeft);

    const section = displaySection || currentSection;

    if (!section) return null;

    const sectionColors: Record<Section, string> = {
        reading: "bg-blue-400",
        listening: "bg-green-400",
        writing: "bg-yellow-400",
        speaking: "bg-pink-400",
    };

    const total = SECTION_LIMITS[section];
    const isActive = section === currentSection && sectionTimeLeft !== undefined;
    const timeLeft = isActive ? sectionTimeLeft : total;
    const elapsed = total - timeLeft;
    const pct = (elapsed / total) * 100;

    return (
        <div className="w-full max-w-lg mx-auto mt-8 flex items-center gap-3">
            <span className="text-blue-600">{icons[section]}</span>
            <span className="font-semibold w-24">{names[section]}</span>
            <div className="flex-1 h-3 rounded bg-gray-200 relative overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${sectionColors[section] ?? "bg-blue-500"}`}
                    style={{ width: `${isActive ? pct : 0}%` }}
                />
            </div>
            <span className="w-14 text-right font-mono">{formatTime(timeLeft)}</span>
        </div>
    );
}