import React, { useState, useEffect } from "react";

export default function EditSlider({ closeModal, slide }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("Оберіть зображення");
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (slide) {
            setTitle(slide.title);
            setDescription(slide.description);
            setImage(slide.image);

            if (slide.image) {
                setImagePreview(
                    `http://localhost:3001/images/slider/${slide.image}`
                );
            }
        }
    }, [slide]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (image) formData.append("image", image);

        try {
            const response = await fetch(
                `http://localhost:3001/api/edit-slide/${slide.id_slider}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );
            if (response.ok) {
                console.log("Слайд успішно оновлено");
                closeModal();
                window.location.reload();
            } else {
                console.error("Помилка при оновленні слайда");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <h2>Редагувати слайд</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Назва"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опис"
                />
                <div className="file-input-container" style={{ width: "89%" }}>
                    <label className="custom-file-input" style={{ width: "100%" }}>
                        {imageName}
                        <input type="file" onChange={handleImageChange} />
                    </label>
                </div>

                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Image Preview" />
                    </div>
                )}
                <button type="submit">Зберегти зміни</button>
                <button type="button" onClick={closeModal}>
                    Скасувати
                </button>
            </form>
        </div>
    );
}
