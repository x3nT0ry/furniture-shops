import React, { useEffect, useState } from "react";
import Admins from "../Components/Admin-header/admin-header";
import Navigation from "../Components/Navigation/navigation";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Admin-panel.css";
import "./Order.css";

export default function AdminPanel() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/outOrders"
                );
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Помилка при отриманні замовлень:", err);
                setError("Не вдалося отримати замовлення");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="admin-container1">
                <Admins />
                <Navigation className="navigation1" />
                <div className="content">
                    <p>Завантаження замовлень...</p>
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

    return (
        <div className="admin-container1">
            <Admins />
            <Navigation className="navigation1" />

            <div className="content1">
                <div className="orders-table-wrapper">
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>№ замовлення</th>
                                    <th>Назва x Кількість x Ціна</th>
                                    <th>Ім'я замовника</th>
                                    <th>Відділення</th>
                                    <th>Загальна сума</th>
                                    <th>Статус оплати</th>
                                    <th>Дата та час</th>
                                    <th>Дія</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>
                                            {order.items &&
                                            order.items.length > 0 ? (
                                                order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        style={{
                                                            marginBottom:
                                                                "10px",
                                                            borderBottom:
                                                                "1px solid white",
                                                        }}
                                                    >
                                                        {item.name}{" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                margin: "0 5px",
                                                            }}
                                                        >
                                                            x
                                                        </span>{" "}
                                                        {item.quantity}{" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                margin: "0 5px",
                                                            }}
                                                        >
                                                            x
                                                        </span>{" "}
                                                        {item.total.toLocaleString(
                                                            "uk-UA"
                                                        )}{" "}
                                                        грн
                                                    </div>
                                                ))
                                            ) : (
                                                <span>Немає товарів</span>
                                            )}
                                        </td>
                                        <td>{order.firstName}</td>
                                        <td>{order.department}</td>
                                        <td>
                                            {order.total.toLocaleString(
                                                "uk-UA"
                                            )}{" "}
                                            грн
                                        </td>
                                        <td>
                                            {order.paymentstatus === 1
                                                ? "Оплачено"
                                                : order.paymentstatus === 2
                                                ? "Накладний платіж"
                                                : "Невідомо"}
                                        </td>
                                        <td>
                                            {order.created_at
                                                ? new Date(
                                                      order.created_at
                                                  ).toLocaleString("uk-UA")
                                                : "Н/Д"}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin-panel/order/${order.id}`}
                                            >
                                                <button className="details-button">
                                                    Деталі
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
