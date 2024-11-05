import React from "react";
import axios from "axios";

const DeleteCard = ({ productId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/deleteCard/${productId}`);
            onDelete(productId); 
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div>
            <button onClick={handleDelete}>Видалити продукт</button>
        </div>
    );
};

export default DeleteCard;
