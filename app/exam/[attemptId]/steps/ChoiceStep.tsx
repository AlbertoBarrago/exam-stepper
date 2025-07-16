'use client';
import { useState } from 'react';
import { Sentence } from "@/lib/steps";

type Props = {
    sentenceList: Sentence[],
    onNextAction: (results: boolean[]) => void; // Now passes results per question
};

export default function ChoiceStep({ sentenceList, onNextAction }: Props) {
    const [selected, setSelected] = useState<string[]>(Array(sentenceList.length).fill(""));
    const [error, setError] = useState<string | null>(null);

    const handleOptionChange = (idx: number, val: string) => {
        setSelected(prev => {
            const next = [...prev];
            next[idx] = val;
            return next;
        });
    };

    const handleSubmit = () => {
        if (selected.some(s => !s)) {
            setError("Please answer all questions.");
            return;
        }
        setError(null);
        // For each answer, check if it's correct
        const results = sentenceList.map((s, idx) => selected[idx] === s.correct);
        onNextAction(results);
    };

    return (
        <div className="space-y-8">
            {sentenceList.map((item, idx) => (
                <div key={idx} className="space-y-2">
                    <p className="text-lg font-medium">
                        {item.sentence.replace('____', '_____')}
                    </p>
                    <div>
                        {item.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={`choice_${idx}`}
                                    value={opt}
                                    checked={selected[idx] === opt}
                                    onChange={() => handleOptionChange(idx, opt)}
                                />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            {error && <p className="text-red-500">{error}</p>}
            <button className="btn mt-4" onClick={handleSubmit}>
                Submit and go next →
            </button>
        </div>
    );
}