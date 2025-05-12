import { vi } from "vitest";
import IFoodService from "../../services/api/food/IFoodService.ts";
import DiaryEntry from "../../services/api/diary/models/DiaryEntry.ts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AlertContext } from "../../context/AlertContext.tsx";
import FoodIntakeForm from "./FoodIntakeForm.tsx";
import { act } from "react";
import styles from "./FoodIntakeForm.module.scss";

const mockFoodService: IFoodService = {
    searchFood: vi.fn().mockResolvedValue({ count: 1, results: [{ id: 1, name: "Tomaten" }] }),
    createFoodIntake: vi.fn().mockResolvedValue({}),
    updateFoodIntake: vi.fn().mockResolvedValue({}),
    deleteFoodIntake: vi.fn().mockResolvedValue(null),
    getFoodId: vi.fn().mockResolvedValue(null)
};

const mockAddAlert = vi.fn();

const renderComponent = (
    onClose = vi.fn(),
    onInsert = vi.fn(),
    diaryEntry?: DiaryEntry
) => {
    return render(
        <AlertContext.Provider value={{ addAlert: mockAddAlert }}>
            <FoodIntakeForm
                onClose={onClose}
                onAction={onInsert}
                foodService={mockFoodService}
                diaryEntry={diaryEntry}
            />
        </AlertContext.Provider>
    );
};

describe("FoodIntakeForm Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("renders the component in create mode", () => {
        // act
        act(() => {
            renderComponent();
        });

        // assert
        expect(screen.getByLabelText(/Lebensmittel/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Hinzufügen/i })).toBeInTheDocument();
    });

    it("renders the component in edit mode when diary entry is passed to component", () => {
        // arrange
        const mockDiaryEntry: DiaryEntry = {
            id: 1,
            date: "2025-05-10",
            name: "Bananen",
            type: "food"
        };

        // act
        renderComponent(vi.fn(), vi.fn(), mockDiaryEntry);


        // assert
        expect(screen.getByLabelText(/Lebensmittel/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Löschen/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Aktualisieren/i })).toBeInTheDocument();
    });


    it("handles input changes", async () => {
        // arrange
        renderComponent();

        // act
        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Bananen" } });

        // assert
        await waitFor(() => expect(mockFoodService.searchFood).toHaveBeenCalledWith("Bananen"));
    });

    it("submits the form", async () => {
        // arrange
        const expectedDate = "2025-05-12";
        renderComponent();
        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Bananen" } });


        const inputDate = document.querySelector(`.${styles.form__inputDate}`) as HTMLInputElement;
        fireEvent.change(inputDate, { target: { value: expectedDate } });

        // act
        const submitButton = document.querySelector(`.${styles.form__submitButton}`) as HTMLButtonElement;
        fireEvent.click(submitButton);

        // assert
        await waitFor(() => {
            expect(mockFoodService.searchFood).toHaveBeenCalledWith("Bananen");

            expect(mockFoodService.createFoodIntake).toHaveBeenCalledWith({
                food_id: 0,
                date: expectedDate
            });
        });
    });

    it("calls onClose and onInsert after form submission", async () => {
        // arrange
        const onClose = vi.fn();
        const onInsert = vi.fn();

        renderComponent(onClose, onInsert);

        const input = document.querySelector(`.${styles.autocomplete__input} input:first-of-type`) as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Tomaten" } });
        const inputDate = document.querySelector(`.${styles.form__inputDate}`) as HTMLInputElement;
        fireEvent.change(inputDate, { target: { value: "2025-05-13" } });

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