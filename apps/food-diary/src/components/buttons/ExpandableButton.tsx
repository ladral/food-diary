import React, { useState, useRef, useEffect } from "react";
import styles from "./ExpandableButton.module.scss";

interface ExpandableButtonProps {
    className?: string;
}


const ExpandableButton: React.FC<ExpandableButtonProps> = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const toggleExpand = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className= {`${styles.expandableButton} ${className}`} ref={buttonRef}>
            <button
                className="fd-icon-add-circle-fill fd-button fd-button--icon"
                onClick={toggleExpand}
                aria-expanded={isOpen}
            >
            </button>
            {isOpen && (
                <div className={`${styles.options} is-flex is-flex-direction-column`}>
                    <button className={`${styles.optionItem} fd-button fd-button--primary-light`}>Food</button>
                    <button className={`${styles.optionItem} fd-button fd-button--primary-light`}>Symptom</button>
                </div>
            )}
        </div>
    );
};

export default ExpandableButton;