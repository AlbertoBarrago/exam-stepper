'use client';


export default function StartButton({handleStart}: { handleStart: () => void}) {

    return (
        <button
            onClick={handleStart}
            className="btn btn-primary"
        >
            Start the free English test →
        </button>
    );
}
