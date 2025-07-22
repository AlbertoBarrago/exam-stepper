import {useEffect} from "react";
import {ModalProps} from "@/types/modalTypes";
/**
 * Simple Modal for confirm event with basic customization
 * @param title
 * @param content
 * @param isOpen
 * @param onConfirm
 * @param onCancel
 * @return JSX.Element
 */
export default function Modal({title, content, isOpen, onConfirm, onCancel}: ModalProps) {
    useEffect(() => {
        const preventEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", preventEsc, true);
        }
        return () => {
            window.removeEventListener("keydown", preventEsc, true);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="fixed inset-0 bg-black/40 transition-opacity"
                aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black/10 p-6">
                <div className="flex flex-col gap-4">
                    <h2
                        id="modal-title"
                        className="text-xl font-semibold text-gray-900"
                    >
                        {title}
                    </h2>
                    <div className="text-base text-gray-600">{content}</div>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        onClick={onCancel}
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        onClick={onConfirm}
                        aria-label="Confirm"
                    >
                        Yes, I confirm
                    </button>
                </div>
            </div>
        </div>
    );
}