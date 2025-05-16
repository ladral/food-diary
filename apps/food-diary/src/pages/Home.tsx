import useKeycloak from "../hooks/useKeycloak";
import "./Home.scss";
import FoodDiaryTable from "../components/list/FoodDiaryTable.tsx";

const HomePage: React.FC = () => {
    const { keycloak, authenticated } = useKeycloak();

    const handleLogin = () => {
        keycloak?.login();
    };

    const handleLogout = () => {
        keycloak?.logout();
    };

    return (
        <div>
            <div className="user card is-flex is-flex-direction-column is-align-items-center">
                {authenticated ? (
                    <button className="user__logout fd-button fd-button--secondary" color="inherit" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button className="user__login fd-button fd-button--secondary" color="inherit" onClick={handleLogin}>
                        Login
                    </button>
                )}
            </div>

            <FoodDiaryTable/>
        </div>
    );
};

export default HomePage;
