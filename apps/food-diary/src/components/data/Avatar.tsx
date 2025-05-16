import styles from "./Avatar.module.scss";
import useKeycloak from "../../hooks/useKeycloak.ts";
import React from "react";

interface AvatarProps {
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ className = styles.avatar}) => {
    const { keycloak } = useKeycloak();
    const username = keycloak?.idTokenParsed?.preferred_username || "Guest";

    return (
        <div className={`is-flex ${styles.avatar} ${className}`}>
            <div className={styles.avatarIcon}>
                <div className="fd-icon-user-fill"></div>
            </div>
            <span className={styles.avatarUsername}>{username}</span>
        </div>
    );

};

export default Avatar;
