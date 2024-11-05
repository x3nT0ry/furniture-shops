import React, { useState } from "react";

export default function AddSlider({ closeModal }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("Оберіть зображення");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("image", image);

        try {
            const response = await fetch(
                "http://localhost:3001/api/add-slide",
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (response.ok) {
                console.log("Слайд успішно додано");
                closeModal();
                window.location.reload();
            } else {
                console.error("Помилка при додаванні слайду");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImageName(e.target.files[0].name);
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <h2>Додати слайд</h2>
                <input
                    type="text"
                    placeholder="Назва"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="file-input-container">
                    <label
                        className="custom-file-input"
                        style={{ width: "82%" }}
                    >
                        {imageName}
                        <input type="file" onChange={handleImageChange} />
                    </label>
                </div>
                {image && (
                    <div className="preview-container">
                        <div className="image-preview">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Попередній перегляд"
                            />
                        </div>
                    </div>
                )}
                <button type="submit">Додати</button>
                <button type="button" onClick={closeModal}>
                    Скасувати
                </button>
            </form>
        </div>
    );
}
