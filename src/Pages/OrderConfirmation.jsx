import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {};

    if (!order) {
        return (
            <div className="order-cancel">
                <h2>Помилка</h2>
                <p>Замовлення не знайдено.</p>
                <button onClick={() => navigate("/")}>
                    Повернутися на головну
                </button>
            </div>
        );
    }

    return (
        <div className="order-confirmation">
            <h2>Дякуємо за ваше замовлення!</h2>
            <p>Ваше замовлення №{order.id} було успішно сплачено.</p>
            <p>Чекайте з Вами обов'язково зв'яжуться!</p>
            <p>Загальна сума: {order.total.toLocaleString("uk-UA")} грн</p>
            <button onClick={() => navigate("/")}>
                Повернутися на головну
            </button>
        </div>
    );
};

export default OrderConfirmation;
