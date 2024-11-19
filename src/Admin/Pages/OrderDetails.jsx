import React, { useEffect, useState } from "react";
import Admins from "../Components/Admin-header/admin-header";
import Navigation from "../Components/Navigation/navigation";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Pdf from "../Components/Pdf/Pdf";
import "./OrderDetails.css";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/outOrders/${id}`
                );
                setOrder(response.data);
                setLoading(false);
            } catch (err) {
                console.error(
                    "Помилка при отриманні детальної інформації про замовлення:",
                    err
                );
                setError("Не вдалося отримати деталі замовлення");
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="admin-container1">
                <Admins />
                <Navigation className="navigation1" />
                <div className="content">
                    <p>Завантаження деталей замовлення...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-container1">
                <Admins />
                <Navigation className="navigation1" />
                <div className="content">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const getPaymentStatus = (status) => {
        if (status === 1) {
            return { text: "Оплачено" };
        } else if (status === 2) {
            return { text: "Накладний платіж" };
        } else {
            return { text: "Невідомо" };
        }
    };

    const paymentStatus = getPaymentStatus(order.paymentstatus);

    return (
        <div className="admin-container1">
            <Admins />
            <Navigation className="navigation1" />
            <div className="content">
                <div className="order-details-container">
                    <div className="order-column">
                        <h2>Замовлення №{order.id}</h2>
                        <div className="order-info">
                            <p>
                                <strong>Спосіб доставки:</strong>{" "}
                                {order.shippingMethod}
                            </p>

                            <p>
                                <strong>Місто:</strong> {order.city}
                            </p>
                            <p>
                                <strong>Відділення:</strong> {order.department}
                            </p>
                            <p>
                                <strong>Ім'я:</strong> {order.firstName}
                            </p>
                            <p>
                                <strong>Прізвище:</strong> {order.lastName}
                            </p>
                            <p>
                                <strong>Телефон:</strong> {order.phone}
                            </p>
                            <p>
                                <strong>Електронна пошта:</strong> {order.email}
                            </p>
                            <p>
                                <strong>Назва телеграм аккаунта:</strong>{" "}
                                {order.telegram === 0 ||
                                order.telegram == null ||
                                order.telegram === ""
                                    ? "Відсутній"
                                    : order.telegram}
                            </p>

                            <p>
                                <strong>Дата та час замовлення:</strong>{" "}
                                {order.created_at
                                    ? new Date(order.created_at).toLocaleString(
                                          "uk-UA"
                                      )
                                    : "Н/Д"}
                            </p>

                            <p>
                                <strong>Статус оплати:</strong>{" "}
                                <span>{paymentStatus.text}</span>
                            </p>
                            <Pdf order={order} className="pdf-button" />
                        </div>
                    </div>
                    <div className="order-column">
                        <h2>Товари в Замовленні</h2>
                        <p>
                            <strong>Загальна сума замовлення: </strong>
                            <span style={{ color: "#c10015" }}>
                                {order.total.toLocaleString("uk-UA")} грн
                            </span>
                        </p>

                        <div className="order-items-grid">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item) => (
                                    <div className="order-item" key={item.id}>
                                        <div className="item-image-container">
                                            {item.image ? (
                                                <img
                                                    src={`http://localhost:3001${item.image}`}
                                                    alt={item.name}
                                                    className="item-image"
                                                />
                                            ) : (
                                                <img
                                                    src="/images/default.png"
                                                    alt="Немає зображення"
                                                    className="item-image"
                                                />
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <p>
                                                <strong>Назва:</strong>{" "}
                                                {item.name}
                                            </p>
                                            <p>
                                                <strong>Кількість:</strong>{" "}
                                                {item.quantity}
                                            </p>
                                            <p>
                                                <strong>Ціна/од:</strong>{" "}
                                                {item.price.toLocaleString(
                                                    "uk-UA"
                                                )}{" "}
                                                грн
                                            </p>
                                            <p>
                                                <strong>Сума:</strong>{" "}
                                                <span
                                                    style={{ color: "#c10015" }}
                                                >
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString(
                                                        "uk-UA"
                                                    )}{" "}
                                                    грн
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Товари відсутні</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="button-container2">
                    <button
                        className="back-button"
                        onClick={() => navigate("/admin-panel/order")}
                    >
                        Назад до списку замовлень
                    </button>
                </div>
            </div>
        </div>
    );
}
