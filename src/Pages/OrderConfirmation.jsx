import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Pdf from "../Admin/Components/Pdf/Pdf";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {};
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/outOrders/${order.id}`
                );
                setOrderDetails(response.data);
            } catch (error) {
                console.error(
                    "Помилка при отриманні деталей замовлення:",
                    error
                );
            }
        };

        if (order) {
            fetchOrderDetails();
        }
    }, [order]);

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

    if (!orderDetails) {
        return <p>Завантаження деталей замовлення...</p>;
    }

    return (
        <div className="order-confirmation">
            <h2>Дякуємо за ваше замовлення!</h2>
            <p>Ваше замовлення №{order.id} було успішно сформоване.</p>
            <p>Чекайте, з вами обов'язково зв'яжуться!</p>
            <p>Загальна сума: {order.total.toLocaleString("uk-UA")} грн</p>
            <Pdf order={orderDetails} className="pdf-button" />
            <div className="button-container1">
                <button className="return-home" onClick={() => navigate("/")}>
                    Повернутися на головну
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
