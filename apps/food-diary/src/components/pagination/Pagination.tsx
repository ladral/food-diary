import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
                Vorherige
            </button>
            <span> Seite {currentPage} von {totalPages} </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
                Nächste
            </button>
        </div>
    );
};

export default Pagination;
