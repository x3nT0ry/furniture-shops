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
    const [characteristics, setCharacteristics] = useState([]);
    const [idCategory, setIdCategory] = useState("");
    const [images, setImages] = useState({
        image: null,
        hoverImage: null,
        image2: null,
        image3: null,
    });

    const [characteristicsList, setCharacteristicsList] = useState([]);
    const [characteristicOptions, setCharacteristicOptions] = useState([]);

    const categories = [
        { id: 1, name: "Стільці" },
        { id: 2, name: "Шафи" },
        { id: 3, name: "Ліжка" },
        { id: 4, name: "Пуфи" },
        { id: 5, name: "Столи" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(
                    `http://localhost:3001/api/editCard/${id}`
                );
                const data = productResponse.data;

                setProductData(data);
                setName(data.name);
                setPrice(data.price);
                setDescription(data.description);

                const additionalInfoData = data.additionalInfo
                    ? JSON.parse(data.additionalInfo)
                    : [];
                setAdditionalInfo(
                    Array.isArray(additionalInfoData) ? additionalInfoData : []
                );

                setIdCategory(data.id_category);

                const characteristicsData = Array.isArray(data.characteristics)
                    ? data.characteristics.map((char) => ({
                          characteristicId: char.characteristicId.toString(),
                          optionId: char.optionId.toString(),
                      }))
                    : [];
                setCharacteristics(characteristicsData);

                const [charResponse, optionResponse] = await Promise.all([
                    axios.get("http://localhost:3001/api/characteristics"),
                    axios.get(
                        "http://localhost:3001/api/characteristicOptions"
                    ),
                ]);

                setCharacteristicsList(charResponse.data);
                setCharacteristicOptions(optionResponse.data);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            setImages((prev) => ({ ...prev, [imageKey]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("additionalInfo", JSON.stringify(additionalInfo));
        formData.append("id_category", idCategory);
        formData.append("characteristics", JSON.stringify(characteristics));
        if (images.image) formData.append("image", images.image);
        if (images.hoverImage) formData.append("hoverImage", images.hoverImage);
        if (images.image2) formData.append("image2", images.image2);
        if (images.image3) formData.append("image3", images.image3);

        try {
            await axios.put(
                `http://localhost:3001/api/editCard/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
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

    const addCharacteristic = () => {
        setCharacteristics((prev) => [
            ...prev,
            { characteristicId: "", optionId: "" },
        ]);
    };

    const handleCharacteristicChange = (index, field, value) => {
        const updatedCharacteristics = [...characteristics];
        updatedCharacteristics[index][field] = value;
        if (field === "characteristicId") {
            updatedCharacteristics[index]["optionId"] = "";
        }
        setCharacteristics(updatedCharacteristics);
    };

    const removeCharacteristic = (index) => {
        const updatedCharacteristics = characteristics.filter(
            (_, i) => i !== index
        );
        setCharacteristics(updatedCharacteristics);
    };

    const createImageURL = (filePath) => {
        return filePath ? `http://localhost:3001${filePath}` : null;
    };

    const displayFilename = (filename) => {
        const maxLength = 30;
        if (filename.length > maxLength) {
            return filename.substring(0, 27) + "...";
        }
        return filename;
    };

    if (!productData) {
        return <div>Loading...</div>;
    }

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
                                    type="text"
                                    placeholder="Назва"
                                    className="input-custom1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
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
                                    required
                                />
                            </label>

                            <label>Оберіть основне фото:</label>
                            <label className="custom-file-input">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "image")
                                    }
                                    style={{ display: "none" }}
                                />
                                <span>
                                    {images.image
                                        ? displayFilename(images.image.name)
                                        : productData.image
                                        ? displayFilename(
                                              productData.image.split("/").pop()
                                          )
                                        : "Оберіть зображення"}
                                </span>
                            </label>
                            {images.image && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={URL.createObjectURL(
                                                images.image
                                            )}
                                            alt="Попередній перегляд"
                                        />
                                    </div>
                                </div>
                            )}
                            {productData.image && !images.image && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={createImageURL(
                                                productData.image
                                            )}
                                            alt="Поточне зображення"
                                        />
                                    </div>
                                </div>
                            )}

                            <label>Оберіть фото при наведенні:</label>
                            <label className="custom-file-input">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "hoverImage")
                                    }
                                    style={{ display: "none" }}
                                />
                                <span>
                                    {images.hoverImage
                                        ? displayFilename(
                                              images.hoverImage.name
                                          )
                                        : productData.hoverImage
                                        ? displayFilename(
                                              productData.hoverImage
                                                  .split("/")
                                                  .pop()
                                          )
                                        : "Оберіть зображення"}
                                </span>
                            </label>
                            {images.hoverImage && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={URL.createObjectURL(
                                                images.hoverImage
                                            )}
                                            alt="Попередній перегляд"
                                        />
                                    </div>
                                </div>
                            )}
                            {productData.hoverImage && !images.hoverImage && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={createImageURL(
                                                productData.hoverImage
                                            )}
                                            alt="Поточне зображення"
                                        />
                                    </div>
                                </div>
                            )}

                            <h2 style={{ marginTop: "40px" }}>
                                Додаткові фото
                            </h2>

                            <label>Додаткова картинка 2:</label>
                            <label className="custom-file-input">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "image2")
                                    }
                                    style={{ display: "none" }}
                                />
                                <span>
                                    {images.image2
                                        ? displayFilename(images.image2.name)
                                        : productData.image2
                                        ? displayFilename(
                                              productData.image2
                                                  .split("/")
                                                  .pop()
                                          )
                                        : "Оберіть зображення"}
                                </span>
                            </label>
                            {images.image2 && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={URL.createObjectURL(
                                                images.image2
                                            )}
                                            alt="Попередній перегляд"
                                        />
                                    </div>
                                </div>
                            )}
                            {productData.image2 && !images.image2 && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={createImageURL(
                                                productData.image2
                                            )}
                                            alt="Поточне зображення"
                                        />
                                    </div>
                                </div>
                            )}

                            <label>Додаткова картинка 3:</label>
                            <label className="custom-file-input">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleImageChange(e, "image3")
                                    }
                                    style={{ display: "none" }}
                                />
                                <span>
                                    {images.image3
                                        ? displayFilename(images.image3.name)
                                        : productData.image3
                                        ? displayFilename(
                                              productData.image3
                                                  .split("/")
                                                  .pop()
                                          )
                                        : "Оберіть зображення"}
                                </span>
                            </label>
                            {images.image3 && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={URL.createObjectURL(
                                                images.image3
                                            )}
                                            alt="Попередній перегляд"
                                        />
                                    </div>
                                </div>
                            )}
                            {productData.image3 && !images.image3 && (
                                <div className="preview-container">
                                    <div className="image-preview1">
                                        <img
                                            src={createImageURL(
                                                productData.image3
                                            )}
                                            alt="Поточне зображення"
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
                                    placeholder="Опис"
                                    className="textarea-custom1"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <label>Додаткова інформація:</label>
                            <div className="additional-info-container1">
                                {additionalInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="additional-info-container1"
                                    >
                                        <textarea
                                            className="textarea-custom2"
                                            placeholder={`Додаткова інформація ${
                                                index + 1
                                            }`}
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
                                            onClick={() => {
                                                const updatedInfo = [
                                                    ...additionalInfo,
                                                ];
                                                updatedInfo.splice(index, 1);
                                                setAdditionalInfo(updatedInfo);
                                            }}
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
                                ))}
                            </div>
                            <button
                                type="button"
                                className="add-row-button1"
                                onClick={addAdditionalInfoField}
                                style={{ marginBottom: "20px" }}
                            >
                                Додати абзац
                            </button>

                            <label>
                                Категорія:
                                <select
                                    className="select-custom1"
                                    value={idCategory}
                                    onChange={(e) =>
                                        setIdCategory(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Оберіть категорію</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="form-section1">
                            <h2>Властивості</h2>
                            <label>Характеристики:</label>
                            <div className="charrs">
                                {characteristics.map((char, index) => (
                                    <div
                                        key={index}
                                        className="characteristic-row"
                                    >
                                        <select
                                            className="select-custom1"
                                            value={char.characteristicId}
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
                                            {characteristicsList.map(
                                                (characteristic) => (
                                                    <option
                                                        key={characteristic.id}
                                                        value={
                                                            characteristic.id
                                                        }
                                                    >
                                                        {characteristic.title}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <select
                                            className="select-custom1"
                                            value={char.optionId}
                                            onChange={(e) =>
                                                handleCharacteristicChange(
                                                    index,
                                                    "optionId",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={!char.characteristicId}
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
                                                        key={option.id}
                                                        value={option.id}
                                                    >
                                                        {option.title}
                                                    </option>
                                                ))}
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCharacteristic(index)
                                            }
                                            className="remove-button1"
                                            disabled={
                                                characteristics.length === 1
                                            }
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}
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
                    <button type="submit" className="submit-button1">
                        Зберегти зміни
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

export default EditCard;
