import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import minusIcon from "../../Images/minus.png";
import minusIconHover from "../../Images/minus-hover.png";
import plusIcon from "../../Images/plus.png";
import plusIconHover from "../../Images/plus-hover.png";
import "./Product-info.css";
import { CartContext } from "../cart/CartContext";

const ProductInfo = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isMinusHovered, setIsMinusHovered] = useState(false);
    const [isPlusHovered, setIsPlusHovered] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/products/${productId}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (product && cartItems.find(item => item.id === product.id)) {
            setIsAddedToCart(true);
        } else {
            setIsAddedToCart(false);
        }
    }, [cartItems, product]);

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    const handleAddToCart = () => {
        if (isAddedToCart) {
            navigate("/cart");
        } else {
            addToCart(product, quantity);  
            setIsAddedToCart(true);
        }
    };

    if (!product) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="product-counter1">
            <p className="product-name1">{product.name}</p>
            <p className="product-price">
                Ціна: {product.price?.toLocaleString("uk-UA")} грн
            </p>
            <p className="product-description">{product.description}</p>
            <div className="divider"></div>
            <div className="counter-container">
                <img
                    src={isMinusHovered ? minusIconHover : minusIcon}
                    alt="Зменшити"
                    className="counter-icon"
                    onClick={decreaseQuantity}
                    onMouseEnter={() => setIsMinusHovered(true)}
                    onMouseLeave={() => setIsMinusHovered(false)}
                />
                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                    min="1" 
                />
                <img
                    src={isPlusHovered ? plusIconHover : plusIcon}
                    alt="Збільшити"
                    className="counter-icon"
                    onClick={increaseQuantity}
                    onMouseEnter={() => setIsPlusHovered(true)}
                    onMouseLeave={() => setIsPlusHovered(false)}
                />
            </div>
            <div style={{ width: "100%" }}>
                <Button className="buy-button" onClick={handleAddToCart}>
                    {isAddedToCart ? "Перейти до корзини" : "Додати в корзину"}
                </Button>
            </div>
        </div>
    );
};

export default ProductInfo;
