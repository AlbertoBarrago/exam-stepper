'use client';
import { useState } from 'react';

export default function FillBlankStep({ html, onNext, answer }:
                                      { html: string; answer: string; onNext: (correct: boolean) => void }) {

    const [typed, setTyped] = useState('');

    const handleSubmit = () => onNext(typed.trim().toLowerCase() === answer);

    return (
        <>
            <p className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            <input
                className="border px-2 py-1 mt-4 w-60"
                value={typed}
                onChange={e => setTyped(e.target.value)}
            />
            <button className="btn ml-4" onClick={handleSubmit}>Submit</button>
        </>
    );
}
