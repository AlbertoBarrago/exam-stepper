import { JSX, useEffect, useState } from "react";
import { useTimerStore } from "@/state/timerStore";
import Modal from "@/components/Modal";
import {useRouter} from "next/navigation";

function PreventBackNavigation(): JSX.Element {
    const resetTimer = useTimerStore((state) => state.reset);
    const [isModalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const onPopState = () => {
            setModalOpen(true);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", onPopState);

        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    const handleConfirm = () => {
        resetTimer();
        router.push("/");
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
        // Trap user in the same history preventing back default behavior
        window.history.pushState(null, "", window.location.href);
    };

    return (
        <Modal
            title="Confirm action"
            content="Do you really want to do this?"
            isOpen={isModalOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
}

export default PreventBackNavigation;