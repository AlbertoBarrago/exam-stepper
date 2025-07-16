'use client';

import Image from 'next/image';
import StartButton from '@/components/StartButton';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col font-sans text-gray-800">
            {/* --- Hero banner --- */}
            <section
                className="flex flex-col items-center justify-center flex-1 text-center bg-gradient-to-b from-blue-50 to-white px-4 py-14 sm:py-14">
                <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl leading-tight tracking-tight">
                    Test and certify your English in&nbsp;50&nbsp;minutes.
                </h1>
                <p className=" text-lg sm:text-xl text-gray-600 max-w-xl">
                    Free. Unlimited retakes. Trusted by learners, schools, and companies worldwide.
                </p>

                <div className="mt-10">
                    <StartButton/>
                </div>

            </section>

            {/* --- How it works --- */}
            <section className="py-10 px-4 bg-white border-t">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center">How the test works</h2>
                <div className="mt-12 grid gap-12 md:grid-cols-3 max-w-6xl mx-auto px-4 sm:px-6">
                    {[
                        {
                            title: 'Listening',
                            desc: 'Listen to short conversations and choose the correct answers.',
                            icon: '🎧',
                        },
                        {
                            title: 'Reading',
                            desc: 'Complete sentences by choosing the correct words.',
                            icon: '📖',
                        },
                        {
                            title: 'Speaking',
                            desc: 'Describe a visual and be evaluated on fluency and clarity.',
                            icon: '🗣️',
                        },
                    ].map((b) => (
                        <div
                            key={b.title}
                            className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <div className="text-5xl mb-4">{b.icon}</div>
                            <h3 className="text-xl font-medium">{b.title}</h3>
                            <p className="mt-2 text-gray-600 text-sm">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="py-4 text-center text-sm text-gray-500 bg-gray-50 border-t">
                ©2025 YourBrand — Inspired by EF SET, not affiliated with EF Education First.
            </footer>
        </main>
    );
}
