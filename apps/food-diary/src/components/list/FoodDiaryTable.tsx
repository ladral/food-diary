import DiaryEntry from "../../services/api/diary/models/DiaryEntry.ts";
import SortableTable from "../tables/SortableTable";
import logger from "../../services/logging/logger";
import styles from "./FoodDiaryTable.module.scss";
import Pagination from "../pagination/Pagination";
import DiaryService from "../../services/api/diary/DiaryService";
import { useEffect, useState } from "react";
import useKeycloak from "../../hooks/useKeycloak.ts";
import ExpandableButton from "../buttons/ExpandableButton.tsx";
import Modal from "../popups/Modal.tsx";
import CreateIntakeForm from "../froms/CreateIntakeForm.tsx";
import FormType from "../froms/FormType.ts";
import CreateSymptomOccurrence from "../froms/CreateSymptomOccurrence.tsx";
import { useAlert } from "../../context/AlertContext.tsx";


const FoodDiaryTable = () => {
    const { authenticated } = useKeycloak();
    const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isModalOpen, setModalOpen] = useState(false)
    const [formType, setFormType] = useState<FormType | null>(null);
    const { addAlert } = useAlert();
    const diaryService = new DiaryService(addAlert);

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

    const openModal = (type: FormType) => {
        setFormType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setFormType(null); // Reset form type when closing
    };


    const onAddFoodOptionSelected = () => {
        logger.debug("add food option selected");
        openModal(FormType.CreateFoodIntake)
    };

    const onAddSymptomOptionSelected = () => {
        logger.debug("add symptom option selected");
        openModal(FormType.CreateSymptomOccurrence)
    };

    const options = [
        { name: "Lebensmittel", action: onAddFoodOptionSelected },
        { name: "Symptom", action: onAddSymptomOptionSelected }
    ];

    const renderForm = () => {
        switch (formType) {
            case FormType.CreateFoodIntake:
                return <CreateIntakeForm onClose={closeModal} />;
            case FormType.CreateSymptomOccurrence:
                return <CreateSymptomOccurrence onClose={closeModal} />
            default:
                return null;
        }
    };

    return (
        <div className={styles.foodDiaryTable}>
            <SortableTable
                className={styles.foodDiaryTable__list}
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

            <ExpandableButton className={styles.foodDiaryTable__diaryAdd} expandOptions={options} />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {renderForm()}
            </Modal>
        </div>
    );
};

export default FoodDiaryTable;
