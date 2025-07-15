export default function WelcomeStep({ html, onNext }: { html: string; onNext: () => void }) {
    return (
        <>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}}/>
            <button className="btn mt-6" onClick={onNext}>Start</button>
        </>
);
}
