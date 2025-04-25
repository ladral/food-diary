import React, { useState, useRef, useEffect } from "react";
import styles from "./ExpandableButton.module.scss";

interface Option {
    name: string;
    action: () => void;
}

interface ExpandableButtonProps {
    className?: string;
    expandOptions: Option[];
}


const ExpandableButton: React.FC<ExpandableButtonProps> = ({ className, expandOptions }) => {
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

    const handleOptionClick = (action: () => void) => {
        action();
        toggleExpand();
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`${styles.expandableButton} ${className}`} ref={buttonRef}>
            <button
                className="fd-icon-add-circle-fill fd-button fd-button--icon"
                onClick={toggleExpand}
                aria-expanded={isOpen}
            >
            </button>
            {isOpen && (
                <div className={`${styles.options} is-flex is-flex-direction-column`}>
                    {expandOptions.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles.optionItem} fd-button fd-button--primary-light`}
                            onClick={() => handleOptionClick(option.action)}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpandableButton;