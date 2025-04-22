import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";

interface NavigationProps {
    className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {

    const handleToggle = () => {
        const checkbox = document.querySelector<HTMLInputElement>("#navbarToggler__checkbox");
        console.log(checkbox)
        if (checkbox) {
            checkbox.click();
        }
    };

    return (
        <div className={`${styles.navbar} ${className}`} onClick={handleToggle}>
            <nav className="flex-column">
                <div className={`${styles.navItem} navItem px-3`}>
                    <NavLink
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                        to="/"
                    >
                        <span className={`${styles.navLinkIcon} fd-icon-book-line`} aria-hidden="true"></span> Logbuch
                    </NavLink>
                </div>

                <div className={`${styles.navItem} px-3`}>
                    <NavLink
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                        to="/analysis"
                    >
                        <span className={`${styles.navLinkIcon} fd-icon-chart-line`} aria-hidden="true"></span> Analyse
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
