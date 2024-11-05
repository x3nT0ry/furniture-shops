import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Admins from "../Components/Admin-header/admin-header";
import Navigation from "../Components/Navigation/navigation";
import "./editCard.css";

const EditCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [tables, setTables] = useState("");
    const [image, setImage] = useState(null);
    const [hoverImage, setHoverImage] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [idCategory, setIdCategory] = useState("");

    const categories = [
        { id: 1, name: "Стільці" },
        { id: 2, name: "Шафи" },
        { id: 3, name: "Ліжка" },
        { id: 4, name: "Пуфи" },
        { id: 5, name: "Столи" },
    ];

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/editCard/${id}`);
                const data = response.data;

                setProductData(data);
                setName(data.name);
                setPrice(data.price);
                setDescription(data.description);
                setAdditionalInfo(Array.isArray(JSON.parse(data.additionalInfo)) ? JSON.parse(data.additionalInfo) : []);
                setTables(data.tables);
                setIdCategory(data.id_category);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchProductData();
    }, [id]);

    const handleImageChange = (e, setImageFunc) => {
        setImageFunc(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("additionalInfo", JSON.stringify(additionalInfo));
        formData.append("tables", tables);
        formData.append("id_category", idCategory);
        if (image) formData.append("image", image);
        if (hoverImage) formData.append("hoverImage", hoverImage);
        if (image2) formData.append("image2", image2);
        if (image3) formData.append("image3", image3);

        try {
            await axios.put(`http://localhost:3001/api/editCard/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate("/admin-panel/product");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleCancel = () => {
        navigate("/admin-panel/product");
    };

    const handleAdditionalInfoChange = (index, value) => {
        const updatedInfo = [...additionalInfo];
        updatedInfo[index] = value;
        setAdditionalInfo(updatedInfo);
    };

    const addAdditionalInfoField = () => {
        setAdditionalInfo([...additionalInfo, ""]);
    };

    const createImageURL = (filePath) => {
        return filePath ? `http://localhost:3001${filePath}` : null;
    };

    if (!productData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-container1">
            <Admins />
            <Navigation className="navigation" />
            <form onSubmit={handleSubmit} className="product-form1">
                <div className="form-layout1">
                    <div className="form-section1 right-section1">
                        <h2>Карта товару</h2>
                        <label>
                            Назва:
                            <input
                                type="text"
                                placeholder="Назва"
                                className="input-custom1"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Ціна:
                            <input
                                type="number"
                                placeholder="Ціна"
                                className="input-custom1"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>

                        <label>Оберіть основне фото:</label>
                        <label className="custom-file-input" style={{ display: 'flex', justifyContent: 'center' }}>
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, setImage)}
                                style={{ display: "none" }}
                            />
                            <span>
                                {image ? image.name : productData.image ? productData.image.split('/').pop() : "Оберіть зображення"}
                            </span>
                        </label>
                        {image && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                        {productData.image && !image && (
                            <img src={createImageURL(productData.image)} alt="Current" style={{ width: '100px', height: 'auto' }} />
                        )}

                        <label>Оберіть фото при наведенні:</label>
                        <label className="custom-file-input" style={{ display: 'flex', justifyContent: 'center' }}>
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, setHoverImage)}
                                style={{ display: "none" }}
                            />
                            <span>
                                {hoverImage ? hoverImage.name : productData.hoverImage ? productData.hoverImage.split('/').pop() : "Оберіть зображення"}
                            </span>
                        </label>
                        {hoverImage && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(hoverImage)}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                        {productData.hoverImage && !hoverImage && (
                            <img src={createImageURL(productData.hoverImage)} alt="Current" style={{ width: '100px', height: 'auto' }} />
                        )}
                    </div>
                    <div className="form-section1 left-section1">
                        <h2>Детальний опис</h2>
                        <label>
                            Опис:
                            <textarea
                                placeholder="Опис"
                                className="textarea-custom1"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                        <label>Додаткова інформація:</label>
                        {additionalInfo.map((info, index) => (
                            <div key={index} className="additional-info-container">
                                <textarea
                                    className="textarea-custom1"
                                    placeholder={`Додаткова інформація ${index + 1}`}
                                    value={info}
                                    onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-row-button1"
                            onClick={addAdditionalInfoField}
                        >
                            Додати поле для додаткової інформації
                        </button>
                        <label>
                            Категорія:
                            <select
                                className="select-custom1"
                                value={idCategory}
                                onChange={(e) => setIdCategory(e.target.value)}
                            >
                                <option value="">Оберіть категорію</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Таблиці:
                            <textarea
                                placeholder="Таблиці"
                                className="textarea-custom1"
                                value={tables}
                                onChange={(e) => setTables(e.target.value)}
                            />
                        </label>
                       
                    </div>
                    <div className="form-section1">
                        <h2>Додаткові фото</h2>

                        <label>Додаткова картинка 2:</label>
                        <label className="custom-file-input" style={{ display: 'flex', justifyContent: 'center' }}>
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, setImage2)}
                                style={{ display: "none" }}
                            />
                            <span>
                                {image2 ? image2.name : productData.image2 ? productData.image2.split('/').pop() : "Оберіть зображення"}
                            </span>
                        </label>
                        {image2 && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(image2)}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                        {productData.image2 && !image2 && (
                            <img src={createImageURL(productData.image2)} alt="Current" style={{ width: '100px', height: 'auto' }} />
                        )}

                        <label>Додаткова картинка 3:</label>
                        <label className="custom-file-input" style={{ display: 'flex', justifyContent: 'center' }}>
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, setImage3)}
                                style={{ display: "none" }}
                            />
                            <span>
                                {image3 ? image3.name : productData.image3 ? productData.image3.split('/').pop() : "Оберіть зображення"}
                            </span>
                        </label>
                        {image3 && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(image3)}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                        {productData.image3 && !image3 && (
                            <img src={createImageURL(productData.image3)} alt="Current" style={{ width: '100px', height: 'auto' }} />
                        )}
                    </div>
                </div>
                <button type="submit" className="submit-button1">Зберегти зміни</button>
                <button type="button" onClick={handleCancel} className="submit-button1">Відміна</button>
            </form>
        </div>
    );
};

export default EditCard;
