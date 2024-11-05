import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import "./main-photo.css";

const baseURL = "http://localhost:3001"; 

const ImageMains = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null); 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${baseURL}/api/photo/${id}`); 
                if (!response.ok) {
                    throw new Error("Мережа відповіла з помилкою: " + response.status);
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Не вдалося отримати продукт:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div>Завантаження...</div>; 
    }

    return (
        <div className="image-mains-wrapper">
            <ImageProduct product={product} />
        </div>
    );
};

const ImageProduct = ({ product }) => {
    const [currentImage, setCurrentImage] = useState(`${baseURL}${product.image}`);
    const [selectedImage, setSelectedImage] = useState(`${baseURL}${product.image}`);
    const [zoomStyle, setZoomStyle] = useState({}); 

    const handleImageClick = (image) => {
        setCurrentImage(`${baseURL}${image}`);
        setSelectedImage(`${baseURL}${image}`);
    };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY, target } = e.nativeEvent;
        const { clientWidth, clientHeight } = target;

        const posX = (offsetX / clientWidth) * 100;
        const posY = (offsetY / clientHeight) * 100;

        setZoomStyle({
            transformOrigin: `${posX}% ${posY}%`,
            transform: "scale(1.5)"
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transform: "scale(1)"
        });
    };

    return (
        <div className="image-mains">
            <div className="thumbnail-container">
                <img
                    src={`${baseURL}${product.image}`}
                    alt="Основне"
                    className={`thumbnail ${selectedImage === `${baseURL}${product.image}` ? 'selected' : ''}`}
                    onClick={() => handleImageClick(product.image)} 
                />
                <img
                    src={`${baseURL}${product.hoverImage}`} 
                    alt="Основне (з вказівником)"
                    className={`thumbnail ${selectedImage === `${baseURL}${product.hoverImage}` ? 'selected' : ''}`}
                    onClick={() => handleImageClick(product.hoverImage)}
                />
                <img
                    src={`${baseURL}${product.image2}`} 
                    alt="Додаткова картинка 1"
                    className={`thumbnail ${selectedImage === `${baseURL}${product.image2}` ? 'selected' : ''}`}
                    onClick={() => handleImageClick(product.image2)}
                />
                <img
                    src={`${baseURL}${product.image3}`} 
                    alt="Додаткова картинка 2"
                    className={`thumbnail ${selectedImage === `${baseURL}${product.image3}` ? 'selected' : ''}`}
                    onClick={() => handleImageClick(product.image3)}
                />
            </div>
            <div className="large-image-container">
                <img
                    src={currentImage} 
                    alt="Велике зображення"
                    className="large-image"
                    style={zoomStyle}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                />
            </div>
        </div>
    );
};

export default ImageMains;
