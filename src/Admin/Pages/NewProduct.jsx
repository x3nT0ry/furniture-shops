import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import Admins from "../Components/Admin-header/admin-header";
import Navigation from "../Components/Navigation/navigation";
import "./NewProduct.css";

const NewProduct = () => {
    const navigate = useNavigate(); 
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        description: "",
        additionalInfo: [""], 
        tables: [
            { left: "", right: "" },
            { left: "", right: "" },
        ],
        id_category: "",
        image: null,
        hoverImage: null,
        image2: null,
        image3: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            setProductData((prev) => ({ ...prev, [imageKey]: file }));
        }
    };

    const removeTableRow = (index) => {
        if (index < 2) return;
        const updatedTables = productData.tables.filter((_, i) => i !== index);
        setProductData((prev) => ({
            ...prev,
            tables: updatedTables,
        }));
    };

    const addAdditionalInfoField = () => {
        setProductData((prev) => ({
            ...prev,
            additionalInfo: [...prev.additionalInfo, ""],
        }));
    };

    const handleAdditionalInfoChange = (index, value) => {
        const updatedAdditionalInfo = [...productData.additionalInfo];
        updatedAdditionalInfo[index] = value;
        setProductData((prev) => ({
            ...prev,
            additionalInfo: updatedAdditionalInfo,
        }));
    };

    const removeAdditionalInfoField = (index) => {
        if (index === 0) return;
        const updatedAdditionalInfo = productData.additionalInfo.filter(
            (_, i) => i !== index
        );
        setProductData((prev) => ({
            ...prev,
            additionalInfo: updatedAdditionalInfo,
        }));
    };

    const addTableRow = () => {
        setProductData((prev) => ({
            ...prev,
            tables: [...prev.tables, { left: "", right: "" }],
        }));
    };

    const handleCancel = () => {
        navigate("/admin-panel/product/");
    };

    const handleTableChange = (index, side, value) => {
        const updatedTables = [...productData.tables];
        updatedTables[index][side] = value;
        setProductData((prev) => ({ ...prev, tables: updatedTables }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in productData) {
            if (key === "tables" || key === "additionalInfo") {
                formData.append(key, JSON.stringify(productData[key]));
            } else {
                formData.append(key, productData[key]);
            }
        }

        try {
            const response = await axios.post(
                "http://localhost:3001/api/addProduct",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error("Ошибка при добавлении товара:", error);
        }
    };

    return (
        <div className="admin-container1">
            <Admins />
            <Navigation className="navigation1" />
            <form onSubmit={handleSubmit} className="product-form1">
                <div className="form-layout1">
                    <div className="form-section1 right-section1">
                        <h2>Карта товару</h2>
                        <label>
                            Назва:
                            <input
                                type="text"
                                name="name"
                                className="input-custom1"
                                value={productData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Ціна:
                            <input
                                type="number"
                                name="price"
                                className="input-custom1"
                                value={productData.price}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>Оберіть основне фото:</label>
                        <label
                            className="custom-file-input"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, "image")}
                                style={{ display: "none" }}
                                required
                            />
                            <span>
                                {productData.image
                                    ? productData.image.name
                                    : "Оберіть зображення"}
                            </span>
                        </label>
                        {productData.image && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(
                                            productData.image
                                        )}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                        <label>Оберіть фото при наведенні:</label>
                        <label
                            className="custom-file-input"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <input
                                type="file"
                                onChange={(e) =>
                                    handleImageChange(e, "hoverImage")
                                }
                                style={{ display: "none" }}
                                required
                            />
                            <span>
                                {productData.hoverImage
                                    ? productData.hoverImage.name
                                    : "Оберіть зображення"}
                            </span>
                        </label>
                        {productData.hoverImage && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(
                                            productData.hoverImage
                                        )}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-section1 left-section1">
                        <h2>Детальний опис</h2>
                        <label>
                            Опис:
                            <textarea
                                name="description"
                                className="textarea-custom1"
                                value={productData.description}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Додаткова інформація:
                            <div
                                className="additional-info-container"
                                style={{
                                    maxHeight: "112px",
                                    overflowY: "auto",
                                }}
                            >
                                {productData.additionalInfo.map(
                                    (info, index) => (
                                        <div
                                            key={`additional-info-${index}`} 
                                            className="additional-info-container"
                                        >
                                            <textarea
                                                className="textarea-custom1"
                                                value={info}
                                                onChange={(e) =>
                                                    handleAdditionalInfoChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeAdditionalInfoField(
                                                        index
                                                    )
                                                }
                                                className="remove-button"
                                                style={{
                                                    display:
                                                        index === 0
                                                            ? "none"
                                                            : "block",
                                                }} 
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={addAdditionalInfoField}
                                className="add-row-button1"
                            >
                                Додати абзац
                            </button>
                        </label>

                        <label>
                            Категорія:
                            <select
                                name="id_category"
                                className="select-custom1"
                                onChange={handleChange}
                                required
                            >
                                <option value="">Оберіть категорію</option>
                                <option value="1">Стільці</option>
                                <option value="2">Шафи</option>
                                <option value="3">Ліжка</option>
                                <option value="4">Пуфи</option>
                                <option value="5">Столи</option>
                            </select>
                        </label>
                        <div>
                            <h3>Таблиця</h3>
                            <div className="table-container2">
                                {productData.tables.map((table, index) => (
                                    <div
                                        className="table-row1"
                                        key={`table-row-${index}`}
                                    >
                                        {" "}
                                        <input
                                            type="text"
                                            placeholder="Характеристика"
                                            className="input-custom1"
                                            value={table.left}
                                            onChange={(e) =>
                                                handleTableChange(
                                                    index,
                                                    "left",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Значення"
                                            className="input-custom1"
                                            value={table.right}
                                            onChange={(e) =>
                                                handleTableChange(
                                                    index,
                                                    "right",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {index < 2 ? (
                                            <button
                                                type="button"
                                                className="check-button"
                                            >
                                                ✔
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTableRow(index)
                                                }
                                                className="remove-button1"
                                            >
                                                ✖
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addTableRow}
                                className="add-row-button1"
                            >
                                Додати рядок
                            </button>
                        </div>
                    </div>

                    <div className="form-section1">
                        <h2>Додаткові фото</h2>
                        <label>Оберіть додаткове фото 1:</label>
                        <label
                            className="custom-file-input"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, "image2")}
                                style={{ display: "none" }}
                                required
                            />
                            <span>
                                {productData.image2
                                    ? productData.image2.name
                                    : "Оберіть зображення"}
                            </span>
                        </label>
                        {productData.image2 && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(
                                            productData.image2
                                        )}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                        <label>Оберіть додаткове фото 2:</label>
                        <label
                            className="custom-file-input"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, "image3")}
                                style={{ display: "none" }}
                                required
                            />
                            <span>
                                {productData.image3
                                    ? productData.image3.name
                                    : "Оберіть зображення"}
                            </span>
                        </label>
                        {productData.image3 && (
                            <div className="preview-container">
                                <div className="image-preview1">
                                    <img
                                        src={URL.createObjectURL(
                                            productData.image3
                                        )}
                                        alt="Попередній перегляд"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" className="submit-button1">
                    Додати товар
                </button>
                <button
                    type="submit"
                    onClick={handleCancel}
                    className="submit-button1"
                >
                    Відміна
                </button>{" "}
            </form>
        </div>
    );
};

export default NewProduct;
