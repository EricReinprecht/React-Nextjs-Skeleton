"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

import "@styles/components/modal.scss"
import { CloseModal } from "@svgs";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="close" onClick={onClose}><CloseModal/></div>
                {children}
            </div>
        </div>,
        document.body
    );
}