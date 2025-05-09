import React, { useState } from "react";
import styles from "./CreateSymptomOccurrence.module.scss";
import { useAlert } from "../../context/AlertContext.tsx";
import SymptomService from "../../services/api/symptom/SymptomService.ts";
import GetSymptomResponse from "../../services/api/symptom/models/GetSymptomResponse.ts";
import { Autocomplete, TextField } from "@mui/material";

interface CreateSymptomOccurrenceProps {
    onClose: () => void;
    onInsert: () => void;
}

const CreateSymptomOccurrence: React.FC<CreateSymptomOccurrenceProps> = ({ onClose, onInsert }) => {
    const [symptomName, setSymptomName] = useState("");
    const [symptomId, setSymptomId] = useState(0);
    const [date, setDate] = useState("");
    const { addAlert } = useAlert();
    const symptomService = new SymptomService(addAlert);
    const [symptoms, setSymptoms] = useState<GetSymptomResponse[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSymptomName("");
        let id = symptomId;
        if (id === 0) {
            id = await addSymptom(symptomName);
        }

        await symptomService.createSymptomOccurence({ symptom_id: id, date });
        onInsert();
        onClose();
    };

    const addSymptom = async (name: string): Promise<number> => {
        const symptom = await symptomService.createSymptom({ name: name });

        if (symptom && symptom.id) {
            setSymptomId(symptom.id);
            setSymptomName(symptom.name);
            return symptom.id;
        }

        return 0;
    };

    const handleSearch = async (symptomSearchString: string) => {
        if (symptomSearchString.trim()) {
            const getSymptomsResponse = await symptomService.searchSymptom(symptomSearchString);
            if (getSymptomsResponse && getSymptomsResponse.count > 0) {
                setSymptoms(getSymptomsResponse.results);
            } else {
                setSymptoms([]);
            }
        }
    };

    return (
        <form className={`${styles.form} is-flex is-flex-direction-column`} onSubmit={handleSubmit}>
            <div className={`${styles.form__input} is-flex is-flex-direction-row`}>
                <Autocomplete
                    className={styles.autocomplete}
                    options={symptoms.map(symptom => symptom.name)}
                    inputValue={symptomName}
                    onInputChange={(event, newInputValue) => {
                        if (event !== null && event.type === "change") {
                            handleSearch(newInputValue);
                            setSymptomName(newInputValue);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField className={styles.autocomplete__input} {...params} label="Symptom"
                                   variant="outlined" />
                    )}
                    onChange={(_event, value) => {
                        setSymptoms([]);
                        if (value) {
                            const selectedFood = symptoms.filter(symptom => symptom.name === value)[0];
                            setSymptomName(selectedFood.name);
                            setSymptomId(selectedFood.id);
                        }
                    }}
                />
                <input
                    className={`${styles.form__inputDate} fd-input fd-input--light`}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <button className={`${styles.form__submitButton} is-align-self-flex-end fd-button fd-button--primary`}
                    type="submit">
                Hinzufügen
            </button>
        </form>
    );
};

export default CreateSymptomOccurrence;
