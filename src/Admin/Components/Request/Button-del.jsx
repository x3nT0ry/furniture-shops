import React, { useState } from "react";

const ButtonDel = ({ selectedRequestIds, onDelete }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (selectedRequestIds.length === 0) {
            console.error("No requests selected for deletion.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3001/api/delete-requests`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ids: selectedRequestIds }),
                }
            );

            if (response.ok) {
                console.log("Запити успішно видалені");
                onDelete(selectedRequestIds);
                setShowModal(false);
            } else {
                console.error("Помилка при видаленні запитів");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <button className="delete-button" onClick={handleDeleteClick}>
                Видалити
            </button>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Ви впевнені, що хочете видалити вибрані запити?</p>
                        <div className="modal-buttons">
                            <button
                                onClick={handleDelete}
                                className="modal-button confirm"
                            >
                                Так, видалити
                            </button>
                            <button
                                onClick={closeModal}
                                className="modal-button cancel"
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ButtonDel;
