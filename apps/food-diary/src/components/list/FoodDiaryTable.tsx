import DiaryEntry from "../../models/DiaryEntry.ts";
import SortableTable from "../tables/SortableTable.tsx";
import logger from "../../services/logging/logger.ts";
import React from "react";
import styles from "./FoodDiaryTable.module.scss";


interface FoodDiaryTableProps {
    diaryEntries: DiaryEntry[];
}

const FoodDiaryTable: React.FC<FoodDiaryTableProps> = ({ diaryEntries }) => {
    const columns = [
        { label: "Datum", accessor: "date" },
        { label: "Name", accessor: "name" },
        { label: "Typ", accessor: "type" }
    ];

    const onDeletEntry = (id: number) => {
        logger.debug("delete entry " + id);
    };

    const onUpdateEntry = (id: number) => {
        logger.debug("update entry " + id);
    };

    return (
        <div className={styles.foodDiaryTable}>

            <SortableTable className={styles.foodDiaryTable}
                           columns={columns}
                           data={diaryEntries}
                           onDelete={onDeletEntry}
                           onUpdate={onUpdateEntry} idProperty="id"
            />
        </div>
    );
};

export default FoodDiaryTable;
