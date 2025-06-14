import React, { useState, useRef, useEffect } from "react";
import styles from "./ExpandableButton.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { Variants } from "motion";

interface Option {
    name: string;
    action: () => void;
}

interface ExpandableButtonProps {
    className?: string;
    expandOptions: Option[];
}

const ExpandableButton: React.FC<ExpandableButtonProps> = ({ className = styles.expandableButton, expandOptions }) => {
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
                className={`${styles.expandableButton__toggle} fd-icon-add-circle-fill fd-button fd-button--icon`}
                onClick={toggleExpand}
                aria-expanded={isOpen}
            >
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.options}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={optionsVariants}
                    >
                        {expandOptions.map((option, index) => (
                            <button
                                key={index}
                                className={`${styles.optionItem} fd-button fd-button--primary-light`}
                                onClick={() => handleOptionClick(option.action)}
                            >
                                {option.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const optionsVariants : Variants = {
    open: (height = 400) => ({
        clipPath: `circle(${height * 2 + 200}px at 105px 100px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        },
    }),
    closed: {
        clipPath: "circle(30px at 105px 100px)",
        transition: {
            type: "spring",
            stiffness: 1000,
            damping: 55,
        },
    },
};

export default ExpandableButton;
