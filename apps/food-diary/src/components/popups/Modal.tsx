import styles from "./Modal.module.scss";
import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
    const modalContentRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const isInsideModal = modalContentRef.current && modalContentRef.current.contains(event.target as Node);

        // hack of the day - prevent children of type MuiAutocomplente to close the modal
        const isAutocomplete = Array.from((event.target as HTMLElement).classList).some(className =>
            className.startsWith("MuiAutocomplete")
        );

        if (!isInsideModal && !isAutocomplete) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={`${styles.modal} is-flex`}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
