import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Admins from "../Admin-header/admin-header"; 
import Navigation from "../Navigation/navigation";
import "./request-detail.css";
import backArrow from "../../../Images/left-arrow.png";

export default function RequestDetail() {
    const { id_request } = useParams(); 
    const navigate = useNavigate();
    const [requestDetail, setRequestDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestDetail = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/request/${id_request}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setRequestDetail(data);
            } catch (error) {
                console.error("Error fetching request detail:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetail();
    }, [id_request]);

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error}</div>;
    if (!requestDetail) return <div>Немає даних для цього запиту.</div>;

    return (
        <div className="admin-container1">
            <Admins /> 
            <Navigation className="navigation1" />
            
            <div className="request-detail-content">
                <p
                    className="back-link2"
                    onClick={() => navigate("/admin-panel/request")}
                >
                    <img src={backArrow} alt="Back" className="back-icon2" />
                    <div className="back-text2">Повернутися до звернень</div>
                </p>

                <div className="request-detail">
                    <span className="request-detail-title">Ім'я:</span>{" "}
                    {requestDetail.name}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Прізвище:</span>{" "}
                    {requestDetail.surname}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Email:</span>{" "}
                    {requestDetail.email}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Телефон:</span>{" "}
                    {requestDetail.phone}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Країна:</span>{" "}
                    {requestDetail.country}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Місто:</span>{" "}
                    {requestDetail.city}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Питання клієнта:<br></br></span>{" "}
                    <span className="request-detail-question">
                        {requestDetail.question.length > 30
                            ? requestDetail.question
                                  .match(/.{1,100}/g)
                                  .join("\n")
                            : requestDetail.question}
                    </span>
                </div>

                <div className="request-detail">
                    <span className="request-detail-title">Трекінговий код:</span>{" "}
                    {parseInt(requestDetail.tracking_code) === 0
                        ? "Відсутній"
                        : requestDetail.tracking_code}
                </div>
                <div className="request-detail">
                    <span className="request-detail-title">Дата і час:</span>{" "}
                    {new Date(requestDetail.datetime).toLocaleString()}
                </div>
            </div>
        </div>
    );
}
