import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonDel from "./Button-del";
import "./Request.css";

export default function Request() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequestIds, setSelectedRequestIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/all-requests");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error("Error fetching requests:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleDeleteRequest = () => {
        const idsToDelete = Array.from(selectedRequestIds);
        setRequests((prevRequests) =>
            prevRequests.filter((request) => !idsToDelete.includes(request.id_request))
        );
        setSelectedRequestIds(new Set());
    };

    const handleCheckboxChange = (id) => {
        setSelectedRequestIds((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleRowClick = (id) => {
        handleCheckboxChange(id);
    };

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error}</div>;

    return (
        <div className="request-wrapper">
            {requests.length === 0 ? (
                <p>Немає запитів.</p>
            ) : (
                <>
                    <div className="button-group">
                        {selectedRequestIds.size > 0 && (
                            <ButtonDel
                                selectedRequestIds={Array.from(selectedRequestIds)}
                                onDelete={handleDeleteRequest}
                            />
                        )}
                    </div>

                    <div className="table-container">
                        <table className="request-table">
                            <thead>
                                <tr>
                                    <th>Обрати</th>
                                    <th>Ім'я</th>
                                    <th>Електронна пошта</th>
                                    <th>Країна</th>
                                    <th>Трекінговий код</th>
                                    <th>Питання клієнта</th>
                                    <th>Дата і час</th>
                                    <th>Дія</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id_request} onClick={() => handleRowClick(request.id_request)}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                value={request.id_request}
                                                checked={selectedRequestIds.has(request.id_request)}
                                                onChange={() => handleCheckboxChange(request.id_request)}
                                            />
                                        </td>
                                        <td>{request.name}</td>
                                        <td>{request.email}</td>
                                        <td>{request.country}</td>
                                        <td>
                                            {parseInt(request.tracking_code) === 0
                                                ? "Відсутній"
                                                : request.tracking_code}
                                        </td>
                                        <td>
                                            {request.question.length > 100
                                                ? `${request.question.substring(0, 50)}...`
                                                : request.question}
                                        </td>
                                        <td>
                                            {new Date(request.datetime).toLocaleString()}
                                        </td>
                                        <td>
                                            <button
                                                className="details-button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    navigate(`/admin-panel/request/${request.id_request}`);
                                                }}
                                            >
                                                Деталі
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
