'use client';

import { useRouter } from 'next/navigation';

export default function StartButton() {
    const router = useRouter();

    const handleStart = async () => {
        const res = await fetch('/api/start', { method: 'POST' });
        const { attemptId } = await res.json();
        router.push(`/exam/${attemptId}`);
    };

    return (
        <button
            onClick={handleStart}
            className="btn btn-primary"
        >
            Start the free English test →
        </button>
    );
}
