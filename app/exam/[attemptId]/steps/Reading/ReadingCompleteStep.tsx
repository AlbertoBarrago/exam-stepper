'use client';

type Props = { title: string, onNextAction: () => void };

export default function ReadingCompleteStep({title, onNextAction}: Props) {

    const handleNext = () => {
        onNextAction();
    }

    return (
       <>
           {title}
           <button className="btn mt-6 ml-4" onClick={handleNext}>
               Next →
           </button>
       </>
    );
}