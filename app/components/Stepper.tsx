type Props = { total: number; current: number };

export default function Stepper({ total, current }: Props) {
    return (
       <div className={"m-6"}
       >{current + 1} - {total} <small className={"text-gray-500"}>We can hide this part is just optional view for keeping trace of steps</small></div>
    );
}