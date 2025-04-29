import styles from "./Modal.module.scss";
import { useEffect, useRef } from "react";

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
    const modalContentRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
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

    if (!isOpen) return null;

    return (
        <div className={`${styles.modal} is-flex`}>
            <div className={`${styles.modalContent}`} ref={modalContentRef}>
                <div className="is-flex is-flex-direction-row is-justify-content-end">
                    <div className={styles.close} onClick={onClose}>
                        <i className={`${styles.closeIcon} fd-icon-close-fill`}></i>
                    </div>
                </div>
                <div className="is-flex is-align-items-center is-flex-direction-column">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
