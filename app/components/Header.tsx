"use client";
import { useUserStore } from "@/state/userStore";
import { useTimerStore } from "@/state/timerStore";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionTimerBar from "@/components/SectionTimeBar";
import {StepsConfig} from "@/config/stepsConfig";
import {QUESTION_KINDS, SECTIONS, stepKindToSection} from "@/const/clientShellConst";
import {Section} from "@/types/clientShellTypes";

/**
 * Checks if the provided value is a valid section.
 *
 * @param {string | null} val - The value to be checked.
 * @return {boolean} Returns true if the value is a valid section, otherwise false.
 */
function isSection(val: string | null): val is Section {
    return !!val && SECTIONS.includes(val as Section);
}

/**
 * TickController is a functional component responsible for managing the timer's ticking behavior.
 * It utilizes a timer store to track the state of the timer (running or not) and executes a periodic tick action.
 * The component sets up an interval to invoke the tick action every second when the timer is running,
 * and cleans up the interval when the timer stops.
 *
 * @return {null} Returns null, as this component does not render any UI.
 */
function TickController(): null {
    const tick = useTimerStore(s => s.tick);
    const isRunning = useTimerStore(s => s.isRunning);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => tick(), 1000);
        return () => clearInterval(interval);
    }, [isRunning, tick]);
    return null;
}

export default function Header() {
    const { user, fetchUser, logout } = useUserStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const currentStepIndex = useTimerStore(s => s.currentStepIndex);
    const step = StepsConfig[currentStepIndex];
    const section = stepKindToSection(step.kind);
    const resetTimer = useTimerStore(s => s.reset);
    const startSection = useTimerStore(s => s.startSection);
    const pause = useTimerStore(s => s.pause);

    const prevStepKindRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    useEffect(() => {
        const step = StepsConfig[currentStepIndex];
        const currentKind = step.kind;
        const prevKind = prevStepKindRef.current;
        const thisSection = stepKindToSection(currentKind);

        if (QUESTION_KINDS.includes(currentKind)) {
            if (
                prevKind &&
                stepKindToSection(prevKind) === thisSection &&
                prevKind.endsWith('-intro') &&
                isSection(thisSection)
            ) {
                startSection(thisSection);
            }
        } else if (currentKind.endsWith('-complete')) {
            pause();
        }

        prevStepKindRef.current = currentKind;
    }, [currentStepIndex, startSection, pause]);

    return (
        <header className="w-full px-6 py-3 flex items-center justify-between bg-white shadow sticky top-0 z-50">
            <div className="text-xl font-bold text-blue-700">IdCert</div>
                <SectionTimerBar displaySection={isSection(section) ? section : null} />
                <TickController/>
            <div className="relative" ref={menuRef}>
                {user ? (
                    <button
                        className="flex items-center space-x-2 focus:outline-none"
                        onClick={() => setOpen((v) => !v)}
                    >
                        <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-800">
                            {user.name.charAt(0)}
                        </span>
                        <span className="font-medium">{user.name}</span>
                        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                ) : (
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded font-semibold"
                        onClick={() => void fetchUser()}
                    >
                        Login
                    </button>
                )}
                {open && user && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded z-20">
                        <div className="px-4 py-2 text-gray-700 text-sm">{user.email}</div>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => {
                                logout();
                                setOpen(false);
                                router.push('/');
                                resetTimer();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}