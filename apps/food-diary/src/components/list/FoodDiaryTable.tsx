import DiaryEntry from "../../services/api/diary/models/DiaryEntry.ts";
import SortableTable from "../tables/SortableTable";
import logger from "../../services/logging/Logger.ts";
import styles from "./FoodDiaryTable.module.scss";
import Pagination from "../pagination/Pagination";
import DiaryService from "../../services/api/diary/DiaryService";
import { useEffect, useState } from "react";
import useKeycloak from "../../hooks/useKeycloak.ts";
import ExpandableButton from "../buttons/ExpandableButton.tsx";
import Modal from "../popups/Modal.tsx";
import FoodIntakeForm from "../froms/FoodIntakeForm.tsx";
import FormType from "../froms/FormType.ts";
import SymptomOccurrence from "../froms/SymptomOccurrence.tsx";
import { useAlert } from "../../context/AlertContext.tsx";
import SymptomService from "../../services/api/symptom/SymptomService.ts";
import FoodService from "../../services/api/food/FoodService.ts";
import ErrorHandler from "../../services/error/ErrorHandler.ts";
import FoodDiaryApiClient from "../../services/api/FoodDiaryApiClient.ts";


const FoodDiaryTable = () => {
    const { authenticated } = useKeycloak();
    const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
    const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<DiaryEntry>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formType, setFormType] = useState<FormType | null>(null);
    const { addAlert } = useAlert();
    const errorHandler = new ErrorHandler(addAlert);
    const { keycloak } = useKeycloak();
    const apiClient = new FoodDiaryApiClient(keycloak?.token || "")
    const diaryService = new DiaryService(apiClient, errorHandler);
    const symptomService = new SymptomService(apiClient, errorHandler);
    const foodService = new FoodService(apiClient, errorHandler);

    const columns = [
        { label: "Datum", accessor: "date" },
        { label: "Name", accessor: "name" }
    ];

    const badgeCriteria = {
        columnCriteriaAccessor: "type",
        badgeCriteria: "symptom",
        columnPositionAccessor: "date",
    };

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

    const onInsertEntry = () => {
        fetchDiaryEntries(currentPage);
    };

    const openModal = (type: FormType) => {
        setFormType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        // Reset form type when closing
        setFormType(null);
    };


    const onAddFoodOptionSelected = () => {
        logger.debug("add food option selected");
        openModal(FormType.CreateFoodIntake);
    };

    const onAddSymptomOptionSelected = () => {
        logger.debug("add symptom option selected");
        openModal(FormType.CreateSymptomOccurrence);
    };

    const onEditFoodDiaryEntry = (entry: DiaryEntry) => {
        logger.debug(`edit food diary entry with id ${entry.id}`);
        setSelectedDiaryEntry(entry);

        if (entry.type === "food") {
            openModal(FormType.EditFoodIntake);

        } else {
            openModal(FormType.EditSymptomOccurrence);
        }
    };

    const options = [
        { name: "Lebensmittel", action: onAddFoodOptionSelected },
        { name: "Symptom", action: onAddSymptomOptionSelected }
    ];

    const renderForm = () => {
        switch (formType) {
            case FormType.CreateFoodIntake:
                return <FoodIntakeForm onClose={closeModal} onAction={onInsertEntry} foodService={foodService} />;
            case FormType.CreateSymptomOccurrence:
                return <SymptomOccurrence onClose={closeModal} onAction={onInsertEntry} symptomService={symptomService} />;
            case FormType.EditFoodIntake:
                return <FoodIntakeForm onClose={closeModal} onAction={onInsertEntry} foodService={foodService} diaryEntry={selectedDiaryEntry} />;
            case FormType.EditSymptomOccurrence:
                return <SymptomOccurrence onClose={closeModal} onAction={onInsertEntry} symptomService={symptomService} diaryEntry={selectedDiaryEntry}/>;
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
                onEdit={onEditFoodDiaryEntry}
                badge={badgeCriteria}
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
