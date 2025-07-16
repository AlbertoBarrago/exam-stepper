type Props = { total: number; current: number };

export default function Stepper({ total, current }: Props) {
    //TODO: probably this part it is not necessary in the first release but can be usefully for future
    return (
       <div className={"m-6"}
       >{current + 1} - {total} <small className={"text-gray-500"}>We can hide this part is just optional view for keeping trace of steps</small></div>
    );
}