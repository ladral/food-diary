import styles from "./Modal.module.scss";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
    const modalContentRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        const isInsideModal = modalContentRef.current && modalContentRef.current.contains(event.target as Node);

        // hack of the day - prevent children of type MuiAutocomplente to close the modal
        const isAutocomplete = Array.from((event.target as HTMLElement).classList).some(className =>
            className.startsWith("MuiAutocomplete")
        );

        if (!isInsideModal && !isAutocomplete) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`${styles.modal} is-flex`}>
                    <motion.div
                        className={styles.modalContent}
                        ref={modalContentRef}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="is-flex is-flex-direction-row is-justify-content-end">
                            <div className={styles.close} onClick={onClose}>
                                <i className={`${styles.closeIcon} fd-icon-close-fill`}></i>
                            </div>
                        </div>
                        <div className="is-flex is-align-items-center is-flex-direction-column">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
