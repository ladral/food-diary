import "./Home.scss";
import FoodDiaryTable from "../components/list/FoodDiaryTable.tsx";

const HomePage: React.FC = () => {
    return (
        <div>
            <FoodDiaryTable/>
        </div>
    );
};

export default HomePage;
