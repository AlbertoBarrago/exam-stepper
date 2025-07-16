'use client';
import {useExam} from '@/components/ExamProvider';
import {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";

export default function FinalRecapStep({totalMinutes}: { totalMinutes: number }) {
    const {setFinished} = useExam();
    const [analyzing, setAnalyzing] = useState(true);
    const router = useRouter();



    useEffect(() => {
        setFinished(true);
        const timer = setTimeout(() => setAnalyzing(false), 4000);
        return () => clearTimeout(timer);
    }, [setFinished]);


    const backToHome = () => {
        router.push('/');
    }

    return (
        <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Test Complete!</h2>
            <p>You used {totalMinutes} minutes.</p>
            {analyzing ? (
                <>
                    <p className="text-blue-600">Analyzing results...</p>
                    <div className="loader mx-auto mt-4"/>
                </>
            ) : (
                <>
                    <p className="text-green-600">Your results will be available shortly.</p>
                    <button className="btn mt-4" onClick={backToHome}>Back to Hell</button>
                </>
            )}
        </div>
    );
}