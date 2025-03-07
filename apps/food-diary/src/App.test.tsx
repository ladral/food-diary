import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from './App';

describe('App Component', () => {
    it('renders correctly', () => {
        render(<App />);

        expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument();

        const button = screen.getByRole('button', { name: /count is 0/i });
        expect(button).toBeInTheDocument();
    });

    it('increments count when button is clicked', () => {
        render(<App />);

        const button = screen.getByRole('button', { name: /count is 0/i });

        fireEvent.click(button);

        expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
    });
});