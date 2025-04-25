import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import SortableTable from "./SortableTable.tsx";
import DiaryEntry from "../../models/DiaryEntry.ts";


afterEach(() => {
    cleanup();
});

describe("SortableTable Component", () => {
    const mockData: DiaryEntry[] = [
        {
            id: 1,
            date: "2025-04-25",
            name: "Tomanten",
            type: "food",
        },
        {
            id: 2,
            date: "2025-03-24",
            name: "Kopfschmerzen",
            type: "symptom",
        },

    ];

    const mockColumns = [
        { label: "Datum", accessor: "date" },
        { label: "Name", accessor: "name" },
        { label: "Typ", accessor: "type" }
    ];

    it("renders the table with data and columns", () => {
        // act
        render(<SortableTable data={mockData} columns={mockColumns} idProperty="id" onDelete={() => {console.log("")}} onUpdate={() => console.log()} />);

        // assert
        // Check if table headers are rendered
        expect(screen.getByText("Datum")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Typ")).toBeInTheDocument();

        // Check if table rows are rendered
        expect(screen.getByText("Tomanten")).toBeInTheDocument();
        expect(screen.getByText("Kopfschmerzen")).toBeInTheDocument();
    });


    it("sorts the table by column when a header is clicked", () => {
        // arrange
        render(<SortableTable data={mockData} columns={mockColumns} idProperty="id" onDelete={() => {console.log("")}} onUpdate={() => console.log()} />);

        // act
        const dateHeader = screen.getByText("Datum")
        fireEvent.click(screen.getByText("Datum"));

        // assert
        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("2025-03-24");
        expect(rows[2]).toHaveTextContent("2025-04-25");

        // act
        fireEvent.click(dateHeader);

        // assert
        expect(rows[1]).toHaveTextContent("2025-04-25");
        expect(rows[2]).toHaveTextContent("2025-03-24");
    });

    it("sorts the table by default column on initial render", () => {
        render(<SortableTable data={mockData} columns={mockColumns} idProperty="id" onDelete={() => {console.log("")}} onUpdate={() => console.log()} />);

        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("2025-04-25");
        expect(rows[2]).toHaveTextContent("2025-03-24");
    });

    it("handles empty data gracefully", () => {
        render(<SortableTable data={[]} columns={mockColumns} idProperty="id" onDelete={() => {console.log("")}} onUpdate={() => console.log()} />);

        const rows = screen.queryAllByRole("row");
        expect(rows.length).toBe(1); // Only the header row should be present
    });
});
