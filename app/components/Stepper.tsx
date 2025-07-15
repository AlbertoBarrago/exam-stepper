type Props = { total: number; current: number };

export default function Stepper({total, current}: Props) {
    return (
        <div className="flex gap-2 mb-6">
            {Array.from({length: total}).map((_, i) => (
                <div
                    key={i}
                    className={`h-2 flex-1 rounded-full
            ${i <= current ? 'bg-blue-600' : 'bg-gray-300'}
          `}
                />
            ))}
        </div>
    );
}
