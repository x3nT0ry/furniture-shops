import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./navigation.css";
import productImage from "../../../Images/logo_product.png";
import productImageHover from "../../../Images/logo_product_hover.png";
import orderImage from "../../../Images/logo_order.png";
import orderImageHover from "../../../Images/logo_order_hover.png";
import requestImage from "../../../Images/logo_answer.png";
import requestImageHover from "../../../Images/logo_answer_hover.png";
import sliderImage from "../../../Images/logo_slider.png";
import sliderImageHover from "../../../Images/logo_slider_hover.png";

export default function Navigation() {
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const [activeItem, setActiveItem] = useState(null);

    useEffect(() => {
        switch (location.pathname) {
            case "/admin-panel/product":
                setActiveItem(0);
                break;
            case "/admin-panel/order":
                setActiveItem(1);
                break;
            case "/admin-panel/request":
                setActiveItem(2);
                break;
            case "/admin-panel/slide":
                setActiveItem(3);
                break;
            default:
                setActiveItem(null);
                break;
        }
    }, [location.pathname]);

    const handleClick = (index, path) => {
        setActiveItem(index);
        navigate(path);
    };

    const getImage = (index) => {
        switch (index) {
            case 0:
                return activeItem === 0 ? productImageHover : productImage;
            case 1:
                return activeItem === 1 ? orderImageHover : orderImage;
            case 2:
                return activeItem === 2 ? requestImageHover : requestImage;
            case 3:
                return activeItem === 3 ? sliderImageHover : sliderImage;
            default:
                return productImage; 
        }
    };

    return (
        <div className="nav-container">
            <div className="empty-space1"></div>
            <div className="empty-space"></div>
            {["Товари", "Замовлення", "Звернення", "Слайдер"].map((text, index) => {
                const path = [
                    "/admin-panel/product",
                    "/admin-panel/order",
                    "/admin-panel/request",
                    "/admin-panel/slide"
                ][index];
                
                return (
                    <div
                        key={index}
                        className={`nav-item ${activeItem === index ? "active" : ""}`}
                        onClick={() => handleClick(index, path)}
                    >
                        <img
                            src={getImage(index)}
                            alt={text}
                            className="nav-img"
                        />
                        <span className="nav-text">{text}</span>
                    </div>
                );
            })}
            <div className="empty-space"></div>
        </div>
    );
}
