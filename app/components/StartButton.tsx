'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

export default function StartButton() {
    const router = useRouter();

    //TODO: Add here the logic for retrieve the attemptId now is mocked

    return (
        <button
            onClick={() => {
                const attemptId = uuid();           // random id now, DB id later
                router.push(`/exam/${attemptId}`);
            }}
            className="btn btn-primary"
        >
            Start the free English test →
        </button>
    );
}
