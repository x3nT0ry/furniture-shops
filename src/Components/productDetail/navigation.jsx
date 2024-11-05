import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ product }) => {
    const navigate = useNavigate();

    const handleAllProductsClick = () => {
        navigate("/furniture"); 
    };

    const handleCategoryClick = () => {
       
        if (product.categoryName) {
            navigate(`/furniture?category=${encodeURIComponent(product.categoryName)}`); 
        }
    };

    return (
        <div className="navigation-wrapper1">
            <div className="navigation1">
                <span onClick={handleAllProductsClick} className="nav-link1">
                    Товари
                </span>
                <span> / </span>
                <span 
                    onClick={handleCategoryClick} 
                    className="nav-link1"
                >
                    {product.categoryName} 
                </span>
            </div>
        </div>
    );
};

export default Navigation;
