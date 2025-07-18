'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

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
