import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CreateSymptomOccurrence from './CreateSymptomOccurrence';
import { AlertContext } from '../../context/AlertContext.tsx';
import styles from "./CreateSymptomOccurrence.module.scss";
import ISymptomService from "../../services/api/symptom/ISymptomService.ts";
import DiaryEntry from "../../services/api/diary/models/DiaryEntry.ts";


const mockAddAlert = vi.fn();
const mockCreateSymptomOccurrence = vi.fn();
const mockSearchSymptom = vi.fn();

const mockSymptomService : ISymptomService = {
    createSymptom: vi.fn().mockResolvedValue({ id: 1, name: 'Headache' }),
    searchSymptom: vi.fn().mockResolvedValue({ count: 1, results: [{ id: 1, name: 'Kopfschmerzen' }] }),
    createSymptomOccurrence: vi.fn().mockResolvedValue({}),
    updateSymptomOccurrence: vi.fn().mockResolvedValue({}),
    deleteSymptomOccurrence: vi.fn().mockResolvedValue(null)
};

const renderComponent = (
    onClose = vi.fn(),
    onInsert = vi.fn(),
    diaryEntry?: DiaryEntry
) => {
    return render(
        <AlertContext.Provider value={{ addAlert: mockAddAlert }}>
            <CreateSymptomOccurrence
                onClose={onClose}
                onAction={onInsert}
                symptomService={mockSymptomService}
                diaryEntry={diaryEntry}
            />
        </AlertContext.Provider>
    );
};

describe('CreateSymptomOccurrence Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component in create mode', () => {
        // act
        renderComponent();

        // assert
        expect(screen.getByLabelText(/symptom/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Hinzufügen/i })).toBeInTheDocument();
    });

    it('renders the component in edit mode when diary entry is passed to component', () => {
        // arrange
        const mockDiaryEntry: DiaryEntry = {
            id: 1,
            date: '2025-05-10',
            name: 'Kopfschmerzen',
            type: 'Symptom',
        };

        // act
        renderComponent(vi.fn(), vi.fn(), mockDiaryEntry);

        // assert
        expect(screen.getByLabelText(/symptom/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Löschen/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Aktualisieren/i })).toBeInTheDocument();
    });

    it('handles input changes', async () => {
        // arrange
        renderComponent();

        // act
        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Kopfschmerzen' } });

        // assert
        await waitFor(() => expect(mockSymptomService.searchSymptom).toHaveBeenCalledWith('Kopfschmerzen'));
    });

    it('submits the form', async () => {
        // arrange
        renderComponent();
        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Kopfschmerzen' } });
        const inputDate = document.querySelector(`.${styles.form__inputDate}`) as HTMLInputElement;
        fireEvent.change(inputDate, { target: { value: '2025-05-09' } });

        // act
        const submitButton = document.querySelector(`.${styles.form__submitButton}`) as HTMLButtonElement;
        fireEvent.click(submitButton);

        // assert
        await waitFor(() => {
            expect(mockSymptomService.createSymptomOccurrence).toHaveBeenCalledWith({ symptom_id: 1, date: '2025-05-09' });
        });
    });

    it('calls onClose and onInsert after form submission', async () => {
        // arrange
        const onClose = vi.fn();
        const onInsert = vi.fn();
        mockSearchSymptom.mockResolvedValueOnce({ count: 1, results: [{ id: 1, name: 'Kopfschmerzen' }] });
        mockCreateSymptomOccurrence.mockResolvedValueOnce({});

        renderComponent(onClose, onInsert);

        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Kopfschmerzen' } });
        const inputDate = document.querySelector(`.${styles.form__inputDate}`) as HTMLInputElement;
        fireEvent.change(inputDate, { target: { value: '2025-05-09' } });

        // act
        const submitButton = document.querySelector(`.${styles.form__submitButton}`) as HTMLButtonElement;
        fireEvent.click(submitButton);

        // assert
        await waitFor(() => {
            expect(onInsert).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });


    it('updates the date', async () => {
        // arrange
        const expectedDiaryEntryId = 1;
        const existingDiaryEntry: DiaryEntry = {
            id: expectedDiaryEntryId,
            date: '2025-05-10',
            name: 'Kopfschmerzen',
            type: 'Symptom',
        };

        renderComponent(vi.fn(), vi.fn(), existingDiaryEntry);
        const inputDate = document.querySelector(`.${styles.form__inputDate}`) as HTMLInputElement;
        fireEvent.change(inputDate, { target: { value: '2025-06-10' } });

        // act
        const submitButton = document.querySelector(`.${styles.form__submitButton}`) as HTMLButtonElement;
        fireEvent.click(submitButton);

        // assert
        await waitFor(() => {
            expect(mockSymptomService.updateSymptomOccurrence).toHaveBeenCalledWith(expectedDiaryEntryId,  { symptom_id: 1, date: '2025-06-10' });
        });
    });

    it('updates the symptom', async () => {
        // arrange
        const expectedDiaryEntryId = 1;
        const expectedDate = '2025-05-10';
        const existingDiaryEntry: DiaryEntry = {
            id: expectedDiaryEntryId,
            date: expectedDate,
            name: 'Husten',
            type: 'Symptom',
        };

        renderComponent(vi.fn(), vi.fn(), existingDiaryEntry);
        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Kopfschmerzen' } });

        // act
        const submitButton = document.querySelector(`.${styles.form__submitButton}`) as HTMLButtonElement;
        fireEvent.click(submitButton);

        // assert
        await waitFor(() => {
            expect(mockSymptomService.updateSymptomOccurrence).toHaveBeenCalledWith(expectedDiaryEntryId,  { symptom_id: 1, date: expectedDate });
        });
    });

    it('deletes existing entry', async () => {
        // arrange
        const expectedDiaryEntryId = 19;
        const existingDiaryEntry: DiaryEntry = {
            id: expectedDiaryEntryId,
            date: '2025-05-10',
            name: 'Kopfschmerzen',
            type: 'Symptom',
        };

        renderComponent(vi.fn(), vi.fn(), existingDiaryEntry);

        // act
        const deleteButton = document.querySelector(`.${styles.form__deleteButton}`) as HTMLButtonElement;
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => {
            expect(mockSymptomService.deleteSymptomOccurrence).toHaveBeenCalledWith(expectedDiaryEntryId);
        });
    });

});
