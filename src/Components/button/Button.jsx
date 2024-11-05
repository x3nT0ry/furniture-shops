import React from "react";
import "./Button.css";

const Button = ({ children, onClick, style }) => {
    return (
        <button type="submit" className="button-container" onClick={onClick} style={style}>
            {children}
            <span className="triangle triangle1"></span>
            <span className="triangle triangle2"></span>
        </button>
    );
};

export default Button;
