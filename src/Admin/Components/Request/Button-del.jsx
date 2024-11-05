import React, { useState } from "react";

const ButtonDel = ({ selectedRequestIds, onDelete }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = () => {
        setShowModal(true); // Show confirmation modal
    };

    const handleDelete = async () => {
        if (selectedRequestIds.length === 0) {
            console.error("No requests selected for deletion.");
            return; // Exit if no requests are selected
        }

        try {
            const response = await fetch(`http://localhost:3001/api/delete-requests`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ids: selectedRequestIds }) // Send array of IDs
            });

            if (response.ok) {
                console.log("Запити успішно видалені");
                onDelete(selectedRequestIds); // Notify parent component with all selected IDs
                setShowModal(false); // Close the modal after deletion
            } else {
                console.error("Помилка при видаленні запитів");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false); // Close the modal without deleting
    };

    return (
        <>
            <button className="delete-button" onClick={handleDeleteClick}>
                Видалити запис
            </button>
            {showModal && (
                <div className="modal">
                    <p>Ви впевнені, що хочете видалити вибрані запити?</p>
                    <button onClick={handleDelete}>Так, видалити</button>
                    <button onClick={closeModal}>Скасувати</button>
                </div>
            )}
        </>
    );
};

export default ButtonDel;
