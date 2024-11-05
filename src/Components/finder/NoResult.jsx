
import React from "react";
import noResultsImage from "../../Images/error.png"; 
import "./NoResult.css"; 

const NoResultsMessage = () => {
    return (
        <div className="no-result-container" style={{ textAlign: "center" }}>
            <img src={noResultsImage} alt="Error" className="no-result-image" />
            <p className="no-result-text">Вибачте, нічого не знайдено ...</p>
        </div>
    );
};

export default NoResultsMessage;
