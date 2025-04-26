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
        <div className="is-flex is-justify-content-space-between">
            <button className="fd-button fd-button--icon fd-icon-arrow-left-line" onClick={handlePrevious} disabled={currentPage === 1}>
            </button>
            <div className="is-align-content-center"> Seite {currentPage} von {totalPages} </div>
            <button className="fd-button fd-button--icon fd-icon-arrow-right-line" onClick={handleNext} disabled={currentPage === totalPages}>
            </button>
        </div>
    );
};

export default Pagination;
