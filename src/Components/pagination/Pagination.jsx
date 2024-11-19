import React from "react";
import "./Pagintation.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-container">
            <button
                className="page-button"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    className={`page-button ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </button>
            ))}
            <button
                className="page-button"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
