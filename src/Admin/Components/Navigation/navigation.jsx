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
import characteristicImage from "../../../Images/characteristic.png";
import characteristicImageHover from "../../../Images/characteristic_hover.png";

export default function Navigation({ emptySpaceHeight = "86px" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    switch (location.pathname) {
      case "/admin-panel/product":
        setActiveItem(0);
        break;
      case "/admin-panel/characteristic":
        setActiveItem(1);
        break;
      case "/admin-panel/order":
        setActiveItem(2);
        break;
      case "/admin-panel/request":
        setActiveItem(3);
        break;
      case "/admin-panel/slide":
        setActiveItem(4);
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
        return activeItem === 1 ? characteristicImageHover : characteristicImage;
      case 2:
        return activeItem === 2 ? orderImageHover : orderImage;
      case 3:
        return activeItem === 3 ? requestImageHover : requestImage;
      case 4:
        return activeItem === 4 ? sliderImageHover : sliderImage;
      default:
        return productImage;
    }
  };

  return (
    <div className="app-container">
      <div className="nav-container">
        <div className="empty-space" style={{ height: emptySpaceHeight }}></div>
        {[
          "Товари",
          "Властивості",
          "Замовлення",
          "Звернення",
          "Слайдер",
        ].map((text, index) => {
          const path = [
            "/admin-panel/product",
            "/admin-panel/characteristic",
            "/admin-panel/order",
            "/admin-panel/request",
            "/admin-panel/slide",
          ][index];

          const itemStyle = index === 0 ? { borderTop: "1px solid black" } : {};

          return (
            <div
              key={index}
              className={`nav-item ${activeItem === index ? "active" : ""}`}
              onClick={() => handleClick(index, path)}
              style={itemStyle}
            >
              <img src={getImage(index)} alt={text} className="nav-img" />
              <span className="nav-text">{text}</span>
            </div>
          );
        })}
        <div className="empty-space" style={{ height: emptySpaceHeight }}></div>
      </div>
    </div>
  );
}