import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { useNavigate, Link } from "react-router-dom";
import emptyCart from "../../Images/emptyCart.png";
import crossImage from "../../Images/cross1.png";
import hoverCrossImage from "../../Images/crosshover1.png";
import minusIcon from "../../Images/minus.png";
import minusIconHover from "../../Images/minus-hover.png";
import plusIcon from "../../Images/plus.png";
import plusIconHover from "../../Images/plus-hover.png";
import "./CartComp.css";
import Button from "../button/Button";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } =
        useContext(CartContext);
    const navigate = useNavigate();
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [hoveredMinusId, setHoveredMinusId] = useState(null);
    const [hoveredPlusId, setHoveredPlusId] = useState(null);

    const handleProceedToCheckout = () => {
        navigate("/checkout");
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const truncate = (str, max) => {
        return str.length > max ? str.substring(0, max) + "..." : str;
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return; 
        updateQuantity(itemId, newQuantity);
    };

    return (
        <div className="cart-container">
            {cartItems.length > 0 && (
                <div className="pay-delivery-title">Cart</div>
            )}

            {cartItems.length === 0 ? (
                <div
                    className="no-result-container"
                    style={{ textAlign: "center", alignItems: "center" }}
                >
                    <img
                        src={emptyCart}
                        alt="Пустая корзина"
                        className="no-result-image"
                        style={{ marginTop: "93px" }}
                    />
                    <p
                        className="no-result-text"
                        style={{ marginBottom: "43px" }}
                    >
                        На даний момент Ви, нічого ще не обрали!
                    </p>
                    <p
                        className="no-result-text"
                        style={{ marginTop: "-40px", marginBottom: "93px" }}
                    >
                        Ваш кошик пустий...
                    </p>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-info">
                                    <Link
                                        to={`/furniture/${item.id}`}
                                        className="product-link"
                                    >
                                        <div className="cart-item-details">
                                            <img
                                                src={`http://localhost:3001${item.image}`}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                            <span className="cart-item-name">
                                                {truncate(item.name, 45)}
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="cart-item-quantity">
                                    <div
                                        className="counter-container"
                                        style={{
                                            marginBottom: "0px",
                                            borderRadius: "0px",
                                            width: "auto",
                                        }}
                                    >
                                        <img
                                            src={
                                                hoveredMinusId === item.id
                                                    ? minusIconHover
                                                    : minusIcon
                                            }
                                            alt="Уменьшить"
                                            className="counter-icon"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            onMouseEnter={() =>
                                                setHoveredMinusId(item.id)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredMinusId(null)
                                            }
                                        />
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            className="quantity-input"
                                            min="1"
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.id,
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                        <img
                                            src={
                                                hoveredPlusId === item.id
                                                    ? plusIconHover
                                                    : plusIcon
                                            }
                                            alt="Увеличить"
                                            className="counter-icon"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            onMouseEnter={() =>
                                                setHoveredPlusId(item.id)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredPlusId(null)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="cart-item-price">
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString("uk-UA")}{" "}
                                    ₴
                                </div>

                                <div className="cart-item-remove">
                                    <img
                                        src={
                                            hoveredItemId === item.id
                                                ? hoverCrossImage
                                                : crossImage
                                        }
                                        alt="Удалить"
                                        onMouseEnter={() =>
                                            setHoveredItemId(item.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredItemId(null)
                                        }
                                        onClick={() => removeFromCart(item.id)}
                                        className="remove-icon"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <p className="cart-total">
                            Загальна сума:{" "}
                            <span className="total-price1">
                                {totalPrice.toLocaleString("uk-UA")} ₴
                            </span>
                        </p>
                        <div className="checkout-button-container">
                            <Button
                                onClick={handleProceedToCheckout}
                                style={{ padding: "25px", fontSize: "16px" }}
                            >
                                Оформити замовлення
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
