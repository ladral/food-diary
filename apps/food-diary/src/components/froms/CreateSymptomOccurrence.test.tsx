import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CreateSymptomOccurrence from './CreateSymptomOccurrence';
import { AlertContext } from '../../context/AlertContext.tsx';
import styles from "./CreateSymptomOccurrence.module.scss";
import ISymptomService from "../../services/api/symptom/ISymptomService.ts";


const mockAddAlert = vi.fn();
const mockCreateSymptomOccurrence = vi.fn();
const mockSearchSymptom = vi.fn();

const mockSymptomService : ISymptomService = {
    createSymptom: vi.fn().mockResolvedValue({ id: 1, name: 'Headache' }),
    searchSymptom: vi.fn().mockResolvedValue({ count: 1, results: [{ id: 1, name: 'Headache' }] }),
    createSymptomOccurrence: vi.fn().mockResolvedValue({}),
};

const renderComponent = (onClose = vi.fn(), onInsert = vi.fn()) => {
    return render(
        <AlertContext.Provider value={{ addAlert: mockAddAlert }}>
            <CreateSymptomOccurrence onClose={onClose} onInsert={onInsert} symptomService={mockSymptomService} />
        </AlertContext.Provider>
    );
};

describe('CreateSymptomOccurrence Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component correctly', () => {
        // act
        renderComponent();

        // assert
        expect(screen.getByLabelText(/symptom/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /hinzufügen/i })).toBeInTheDocument();
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
});
