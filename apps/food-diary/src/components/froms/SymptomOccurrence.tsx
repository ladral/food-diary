import React, { useEffect, useState } from "react";
import styles from "./SymptomOccurrence.module.scss";
import GetSymptomResponse from "../../services/api/symptom/models/GetSymptomResponse.ts";
import { Autocomplete, TextField } from "@mui/material";
import ISymptomService from "../../services/api/symptom/ISymptomService.ts";
import DiaryEntry from "../../services/api/diary/models/DiaryEntry.ts";

interface CreateSymptomOccurrenceProps {
    onClose: () => void;
    onAction: () => void;
    symptomService: ISymptomService;
    diaryEntry?: DiaryEntry;
}

const SymptomOccurrence: React.FC<CreateSymptomOccurrenceProps> = ({ onClose, onAction, symptomService, diaryEntry }) => {
        const [symptomName, setSymptomName] = useState("");
        const [symptomId, setSymptomId] = useState(0);
        const [date, setDate] = useState("");
        const [symptoms, setSymptoms] = useState<GetSymptomResponse[]>([]);
        const [hasError, setHasError] = useState(false);


        useEffect(() => {
            if (hasError) return;

            if (diaryEntry &&! hasError) {
                setSymptomName(diaryEntry.name);
                setDate(diaryEntry.date);

                const fetchSymptomId = async () => {
                    const symptomId = await symptomService.getSymptomId(diaryEntry.name);
                    if (symptomId) {
                            setSymptomId(symptomId);
                    } else {
                        setHasError(true);
                    }
                };

                fetchSymptomId();
            }

        }, [symptomService, diaryEntry, hasError]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSymptomName("");
            let id = symptomId;

            if (id === 0) {
                id = await addSymptom(symptomName);
            }

            if (diaryEntry) {
                await symptomService.updateSymptomOccurrence(diaryEntry.id, { symptom_id: id, date });
            } else {
                await symptomService.createSymptomOccurrence({ symptom_id: id, date });
            }

            onAction();
            onClose();
        };

        const deleteEntry = async (event: React.FormEvent) => {
            event.preventDefault();
            setSymptomName("");

            if (diaryEntry) {
                await symptomService.deleteSymptomOccurrence(diaryEntry.id);
            }

            onAction();
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
                                const selectedSymptom = symptoms.find(symptom => symptom.name === value);
                                if (selectedSymptom) {
                                    setSymptomName(selectedSymptom.name);
                                    setSymptomId(selectedSymptom.id);
                                }
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
                <div className={`${styles.form__actions} is-flex is-justify-content-space-between`}>
                    {diaryEntry && (
                        <button className={`${styles.form__deleteButton} fd-button fd-button--primary`}
                                type="button"
                                onClick={deleteEntry}>
                            Löschen
                        </button>
                    )}
                    <button className={`${styles.form__submitButton} fd-button fd-button--primary`}
                            type="submit">
                        {diaryEntry ? "Aktualisieren" : "Hinzufügen"}
                    </button>
                </div>
            </form>
        );
    }
;

export default SymptomOccurrence;
