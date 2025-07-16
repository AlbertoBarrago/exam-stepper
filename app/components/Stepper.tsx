type Props = { total: number; current: number };

export default function Stepper({ total, current }: Props) {
    return (
       <>
       {current + 1} - {total}
       </>
    );
}