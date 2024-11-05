import React from "react";
import { useNavigate } from "react-router-dom";
import "./Line.css";

import img1 from "../../Images/line1.jpeg";
import img2 from "../../Images/line2.jpeg";
import img3 from "../../Images/line3.jpg";
import img4 from "../../Images/line4.jpg";
import img5 from "../../Images/line5.jpg";

const products = [
    { id: 1, image: img1, text: "Стільці" },
    { id: 2, image: img2, text: "Шафи" },
    { id: 3, image: img3, text: "Ліжка" },
    { id: 4, image: img4, text: "Пуфи" },
    { id: 5, image: img5, text: "Столи" },
];

export default function Line({ onCategorySelect }) {
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        onCategorySelect(category);
        navigate(`/furniture?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="gallery-wrapper">
            {products.map((product) => (
                <div className="gallery-item" key={product.id} onClick={() => handleCategorySelect(product.text)}>
                    <img
                        src={product.image}
                        alt={product.text}
                        className="image-thumbnail"
                    />
                    <div className="image-label">{product.text}</div>
                </div>
            ))}
        </div>
    );
}
