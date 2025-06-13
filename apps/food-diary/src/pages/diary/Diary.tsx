import "./Diary.scss";
import FoodDiaryTable from "../../components/list/FoodDiaryTable.tsx";
import PageTemplate from "../../components/layout/PageTemplate.tsx";

const DiaryPage: React.FC = () => {
    return (
        <PageTemplate>
            <FoodDiaryTable/>
        </PageTemplate>
    );
};

export default DiaryPage;
