import React, { useState, useRef, useEffect } from "react";
import styles from "./Avatar.module.scss";
import useKeycloak from "../../hooks/useKeycloak.ts";
import { AnimatePresence, motion } from "motion/react";

interface AvatarProps {
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ className = styles.avatar }) => {
    const { keycloak } = useKeycloak();
    const username = keycloak?.idTokenParsed?.preferred_username || "Guest";
    const [isOpen, setIsOpen] = useState(false);
    const avatarRef = useRef<HTMLDivElement | null>(null);

    const toggleUserMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        keycloak?.logout();
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`is-flex ${styles.avatar} ${className}`} ref={avatarRef} onClick={toggleUserMenu}>
            <div className={styles.avatarIcon}>
                <div className="fd-icon-user-fill"></div>
            </div>
            <span className={styles.avatarUsername}>{username}</span>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`${styles.avatar__userMenu} is-flex is-flex-direction-column`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "100%", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.12 }}>
                        <button
                            className={`${styles.optionItem} fd-button fd-button--primary-light`}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Avatar;
