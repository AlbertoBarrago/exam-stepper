'use client';
import { useState } from 'react';

type Props = {
    sentence: string;
    options: string[];
    correct: string;
    onNextAction: (correct: boolean) => void;
};

export default function ChoiceStep({ sentence, options, correct, onNextAction }: Props) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSubmit = () => {
        if (selected) {
            onNextAction(selected === correct);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-lg font-medium">
                {sentence.replace('____', '_____')}
            </p>
            <div className="space-y-2">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="choice"
                            value={opt}
                            checked={selected === opt}
                            onChange={() => setSelected(opt)}
                        />
                        <span>{opt}</span>
                    </label>
                ))}
            </div>
            <button
                className="btn mt-4"
                disabled={!selected}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
}
