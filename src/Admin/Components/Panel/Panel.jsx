import React from "react";
import AdminImg from "../../../Images/admin.png"; 
import "./Panel.css";

const Panel = () => {
    return (
        <div className="panel-container">
            <img src={AdminImg} alt="Вітаємо" className="panel-image" />
            <div className="panel-text">Вітаємо у нашій дружній команді! Дякуємо, що Ви з нами!</div>
        </div>
    );
};

export default Panel;
