import React, { useState, useRef, useEffect } from "react";
import styles from "./Avatar.module.scss";
import useKeycloak from "../../hooks/useKeycloak.ts";

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

            {isOpen && (
                <div className={`${styles.avatar__userMenu} is-flex is-flex-direction-column`}>
                    <button
                        className={`${styles.optionItem} fd-button fd-button--primary-light`}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Avatar;
