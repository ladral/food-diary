import DiaryEntry from "../../models/diary/DiaryEntry";
import SortableTable from "../tables/SortableTable";
import logger from "../../services/logging/logger";
import styles from "./FoodDiaryTable.module.scss";
import Pagination from "../pagination/Pagination";
import DiaryService from "../../services/api/diary/DiaryService";
import { useEffect, useState } from "react";
import useKeycloak from "../../hooks/useKeycloak.ts";
import ExpandableButton from "../buttons/ExpandableButton.tsx";


const FoodDiaryTable = () => {
    const { authenticated } = useKeycloak();
    const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const diaryService = new DiaryService();

    const columns = [
        { label: "Datum", accessor: "date" },
        { label: "Name", accessor: "name" },
        { label: "Typ", accessor: "type" }
    ];

    const fetchDiaryEntries = async (page: number) => {
        try {
            const result = await diaryService.getDiaryList(page);
            if (result) {
                setDiaryEntries(result.results);
                setTotalPages(result.totalPages);
            } else {
                logger.error("No diary entries found");
            }
        } catch (error) {
            logger.error("Failed to fetch diary entries", error);
        }
    };

    useEffect(() => {
        if (authenticated) {
            fetchDiaryEntries(currentPage);
        }
    }, [currentPage, authenticated]);

    const onDeleteEntry = (id: number) => {
        logger.debug("delete entry " + id);
    };

    const onUpdateEntry = (id: number) => {
        logger.debug("update entry " + id);
    };

    const onAddFoodOptionSelected = () => {
        logger.debug("add food");
    };

    const onAddSymptomOptionSelected = () => {
        logger.debug("add symptom");
    };


    const options = [
        { name: "Food", action: onAddFoodOptionSelected },
        { name: "Symptom", action: onAddSymptomOptionSelected }
    ];

    return (
        <div className={styles.foodDiaryTable}>
            <SortableTable
                className={styles.foodDiaryTable}
                columns={columns}
                data={diaryEntries}
                onDelete={onDeleteEntry}
                onUpdate={onUpdateEntry}
                idProperty="id"
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <ExpandableButton className="diary__add" expandOptions={options} />
        </div>
    );
};

export default FoodDiaryTable;
