import React from "react";

export default function DeleteSlider({ closeModal, selectedSlides, onDelete }) {
    const handleDelete = async () => {
        if (selectedSlides.length === 0) {
            console.error("No slides selected for deletion.");
            return; 
        }

        try {
            const response = await fetch(`http://localhost:3001/api/delete-slides`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ids: selectedSlides }) 
            });
            if (response.ok) {
                console.log("Слайди успішно видалені");
                onDelete(selectedSlides);
                closeModal();
            } else {
                console.error("Помилка при видаленні слайдів");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    return (
        <div className="modal">
            <p>Ви впевнені, що хочете видалити вибрані слайди?</p>
            <button
                onClick={handleDelete}
                style={{
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                }}
            >
                Так, видалити
            </button>
            <button onClick={closeModal}>Скасувати</button>
        </div>
    );
}
