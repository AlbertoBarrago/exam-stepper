'use client';
export default function StartButton({handleStartAction}: { handleStartAction: () => void}) {

    return (
        <button
            onClick={handleStartAction}
            className="btn btn-primary"
        >
            Start the free English test →
        </button>
    );
}
