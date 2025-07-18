'use client';

import StartButton from '@/components/StartButton';
import {useUserStore} from "@/state/userStore";
import {useEffect} from "react";

export default function Home() {
    const {loading, error, user, fetchUser} = useUserStore();

    useEffect(() => {
        void fetchUser();
    }, [fetchUser]);


    return (
        <section
            className="flex flex-col items-center justify-center flex-1 text-center bg-gradient-to-b from-blue-50 to-white px-4 py-14 sm:py-14">
            <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl leading-tight tracking-tight">
                Test and certify your English in&nbsp;50&nbsp;minutes.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
                Free. Unlimited retakes. Trusted by learners, schools, and companies worldwide.
            </p>

            <div className="mt-10">
                {!loading && user && <StartButton/>}
            </div>
            {loading && <div className="mt-6 text-blue-700">Loading user...</div>}
            {error && <div className="mt-6 text-red-500">{error}</div>}
        </section>
    );
}