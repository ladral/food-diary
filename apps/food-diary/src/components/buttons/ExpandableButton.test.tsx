import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExpandableButton from "./ExpandableButton";
import styles from "./ExpandableButton.module.scss";

describe("ExpandableButton Component", () => {
    const mockFoodAction = vi.fn();
    const mockSymptomAction = vi.fn();

    const options = [
        { name: "Food", action: mockFoodAction },
        { name: "Symptom", action: mockSymptomAction }
    ];

    beforeEach(() => {
        render(<ExpandableButton expandOptions={options} />);
    });

    test("renders correctly with options", () => {
        // arrange
        const button = document.querySelector(`.${styles.expandableButton__toggle}`) as HTMLButtonElement;

        // act -> render component (beforeEach)

        // assert
        expect(button).toBeInTheDocument();
        expect(screen.queryByText("Food")).not.toBeInTheDocument();
        expect(screen.queryByText("Symptom")).not.toBeInTheDocument();
    });

    test("toggles options visibility when button is clicked", async () => {
        // arrange
        const button = document.querySelector(`.${styles.expandableButton__toggle}`) as HTMLButtonElement;

        // act -> click to expand
        fireEvent.click(button);

        // assert
        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Symptom")).toBeInTheDocument();

        // act -> click to collapse
        fireEvent.click(button);

        //assert
        await waitFor(() => {
            expect(screen.queryByText("Food")).not.toBeInTheDocument();
            expect(screen.queryByText("Symptom")).not.toBeInTheDocument();
        });
    });

    test("executes action and collapses options when an option is clicked", async () => {
        // arrange
        const button = document.querySelector(`.${styles.expandableButton__toggle}`) as HTMLButtonElement;
        fireEvent.click(button);

        // act
        fireEvent.click(screen.getByText("Food"));

        // assert
        expect(mockFoodAction).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.queryByText("Food")).not.toBeInTheDocument();
            expect(screen.queryByText("Symptom")).not.toBeInTheDocument();
        });
    });

    test("closes options when clicking outside the component", async () => {
        // arrange
        const button = document.querySelector(`.${styles.expandableButton__toggle}`) as HTMLButtonElement;
        fireEvent.click(button);
        expect(screen.getByText("Food")).toBeInTheDocument();

        // act
        fireEvent.mouseDown(document);

        // assert
        await waitFor(() => {
            expect(screen.queryByText("Food")).not.toBeInTheDocument();
        });
    });
});
