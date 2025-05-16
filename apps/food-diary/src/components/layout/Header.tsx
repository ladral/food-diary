import Navigation from "./Navigation.tsx";
import styles from "./Header.module.scss";
import Avatar from "../data/Avatar.tsx";

const Header = () => {
    return (
        <header className={`${styles.header} is-flex is-flex-direction-row is-align-items-center is-flex-shrink-0`}>

            <div className={`${styles.header__logo} fd-icon-restaurant-fill`}></div>

            <div className={styles.header__appName}>
                Food Diary
            </div>

            <Avatar className={styles.header__avatar}/>

            <div className={styles.navbarToggler}>
                <input type="checkbox" className={styles.navbarToggler__checkbox} id="navbarToggler__checkbox" />
                <label htmlFor="navbarToggler__checkbox" className={styles.navbarToggler__icon}>
                    <span className={styles.navbarToggler__iconLine}></span>
                    <span className={styles.navbarToggler__iconLine}></span>
                    <span className={styles.navbarToggler__iconLine}></span>
                </label>
                <aside className={`${styles.sidebar} sidebar ${styles.navbarToggler__navbar}`}>
                    <Navigation className={styles.navbar} />
                </aside>
            </div>

        </header>
    );
};

export default Header;