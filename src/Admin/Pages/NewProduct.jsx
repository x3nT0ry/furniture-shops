import React, { useState, useEffect } from "react";
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
        characteristics: [
            {
                characteristicId: "",
                optionId: "",
            },
        ],
        id_category: "",
        image: null,
        hoverImage: null,
        image2: null,
        image3: null,
    });

    const [characteristicsList, setCharacteristicsList] = useState([]);
    const [characteristicOptions, setCharacteristicOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [charResponse, optionResponse] = await Promise.all([
                    axios.get("http://localhost:3001/api/characteristics"),
                    axios.get(
                        "http://localhost:3001/api/characteristicOptions"
                    ),
                ]);

                setCharacteristicsList(charResponse.data);
                setCharacteristicOptions(optionResponse.data);
            } catch (error) {
                console.error("Помилка при завантаженні даних:", error);
            }
        };

        fetchData();
    }, []);

    const displayFilename = (filename) => {
        const maxLength = 30;
        if (filename.length > maxLength) {
            return filename.substring(0, 27) + "...";
        }
        return filename;
    };

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

    const addCharacteristic = () => {
        setProductData((prev) => ({
            ...prev,
            characteristics: [
                ...prev.characteristics,
                { characteristicId: "", optionId: "" },
            ],
        }));
    };

    const handleCharacteristicChange = (index, field, value) => {
        const updatedCharacteristics = [...productData.characteristics];
        updatedCharacteristics[index][field] = value;
        if (field === "characteristicId") {
            updatedCharacteristics[index]["optionId"] = "";
        }
        setProductData((prev) => ({
            ...prev,
            characteristics: updatedCharacteristics,
        }));
    };

    const removeCharacteristic = (index) => {
        const updatedCharacteristics = productData.characteristics.filter(
            (_, i) => i !== index
        );
        setProductData((prev) => ({
            ...prev,
            characteristics: updatedCharacteristics,
        }));
    };

    const handleCancel = () => {
        navigate("/admin-panel/product/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in productData) {
            if (key === "characteristics" || key === "additionalInfo") {
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
            navigate("/admin-panel/product/");
        } catch (error) {
            console.error("Помилка при додаванні товару:", error);
        }
    };

    return (
        <div className="app-container1">
            <Navigation emptySpaceHeight="127px" />
            <div className="main-content">
                <Admins />
                <form onSubmit={handleSubmit} className="product-form1">
                    <div className="form-layout1">
                        <div className="form-section1 right-section1">
                            <h2>Карта товару</h2>
                            <label>
                                Назва:
                                <input
                                    placeholder="Назва"
                                    type="text"
                                    name="name"
                                    className="input-custom2"
                                    value={productData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Ціна:
                                <input
                                    placeholder="Ціна"
                                    type="number"
                                    name="price"
                                    className="input-custom2"
                                    value={productData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>Оберіть основне фото:</label>
                            <label className="custom-file-input1">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "image")
                                    }
                                    style={{ display: "none" }}
                                    required
                                />
                                <span>
                                    {productData.image
                                        ? displayFilename(
                                              productData.image.name
                                          )
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
                            <label className="custom-file-input1">
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
                                        ? displayFilename(
                                              productData.hoverImage.name
                                          )
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

                            <h2 style={{ marginTop: "40px" }}>
                                Додаткові фото
                            </h2>

                            <label>Оберіть додаткове фото 1:</label>
                            <label className="custom-file-input1">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "image2")
                                    }
                                    style={{ display: "none" }}
                                    required
                                />
                                <span>
                                    {productData.image2
                                        ? displayFilename(
                                              productData.image2.name
                                          )
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
                            <label className="custom-file-input1">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "image3")
                                    }
                                    style={{ display: "none" }}
                                    required
                                />
                                <span>
                                    {productData.image3
                                        ? displayFilename(
                                              productData.image3.name
                                          )
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

                        <div className="form-section1 left-section1">
                            <h2>Детальний опис</h2>
                            <label>
                                Опис:
                                <textarea
                                    placeholder={`Опис`}
                                    name="description"
                                    className="textarea-custom1"
                                    value={productData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Додаткова інформація:
                                <div className="additional-info-container">
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
                                                    placeholder={`Додаткова інформація ${
                                                        index + 1
                                                    }`}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAdditionalInfoField(
                                                            index
                                                        )
                                                    }
                                                    className="remove-buttons"
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
                                    style={{ marginBottom: "20px" }}
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
                        </div>

                        <div className="form-section1">
                            <h2>Властивості</h2>
                            <div className="form-section1">
                                <label>Характеристики:</label>
                                <div className="charrs">
                                    {productData.characteristics.map(
                                        (char, index) => {
                                            const selectedCharacteristicIds =
                                                productData.characteristics
                                                    .filter(
                                                        (c, idx) =>
                                                            idx !== index
                                                    )
                                                    .map(
                                                        (c) =>
                                                            c.characteristicId
                                                    )
                                                    .filter((id) => id);

                                            const availableCharacteristics =
                                                characteristicsList.filter(
                                                    (characteristic) =>
                                                        !selectedCharacteristicIds.includes(
                                                            characteristic.id.toString()
                                                        )
                                                );

                                            return (
                                                <div
                                                    key={`characteristic-${index}`}
                                                    className="characteristic-row"
                                                >
                                                    <select
                                                        className="characteristic-select"
                                                        value={
                                                            char.characteristicId
                                                        }
                                                        onChange={(e) =>
                                                            handleCharacteristicChange(
                                                                index,
                                                                "characteristicId",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Оберіть властивість
                                                        </option>
                                                        {availableCharacteristics.map(
                                                            (
                                                                characteristic
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        characteristic.id
                                                                    }
                                                                    value={
                                                                        characteristic.id
                                                                    }
                                                                >
                                                                    {
                                                                        characteristic.title
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    <select
                                                        className="characteristic-select"
                                                        value={char.optionId}
                                                        onChange={(e) =>
                                                            handleCharacteristicChange(
                                                                index,
                                                                "optionId",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        disabled={
                                                            !char.characteristicId
                                                        }
                                                    >
                                                        <option value="">
                                                            Оберіть опцію
                                                        </option>
                                                        {characteristicOptions
                                                            .filter(
                                                                (option) =>
                                                                    option.id_attr ===
                                                                    parseInt(
                                                                        char.characteristicId
                                                                    )
                                                            )
                                                            .map((option) => (
                                                                <option
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    value={
                                                                        option.id
                                                                    }
                                                                >
                                                                    {
                                                                        option.title
                                                                    }
                                                                </option>
                                                            ))}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeCharacteristic(
                                                                index
                                                            )
                                                        }
                                                        className="remove-button1"
                                                        disabled={
                                                            productData
                                                                .characteristics
                                                                .length === 1
                                                        }
                                                    >
                                                        {productData
                                                            .characteristics
                                                            .length === 1
                                                            ? "✔"
                                                            : "✖"}
                                                    </button>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={addCharacteristic}
                                    className="add-row-button1"
                                >
                                    Додати властивість
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-button1">
                        Додати товар
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="submit-button1"
                    >
                        Відміна
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewProduct;
