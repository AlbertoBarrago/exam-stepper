'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

export default function StartButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => {
                const attemptId = uuid();           // random id now, DB id later
                router.push(`/exam/${attemptId}`);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
            Start the free English test →
        </button>
    );
}
