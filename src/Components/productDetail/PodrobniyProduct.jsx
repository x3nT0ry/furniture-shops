import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PodrobniyProduct.css";

const PodrobniyProduct = ({ productId }) => {
    const [isDescriptionOpen, setDescriptionOpen] = useState(true);
    const [isCharacteristicsOpen, setCharacteristicsOpen] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/product/${productId}`
                );

                const data = response.data;

                let additionalInfoData = data.additionalInfo;
                if (typeof additionalInfoData === "string") {
                    try {
                        additionalInfoData = JSON.parse(additionalInfoData);
                    } catch (error) {
                        console.error(
                            "Помилка парсингу additionalInfo на фронтенді:",
                            error
                        );
                        additionalInfoData = [];
                    }
                }

                setAdditionalInfo(
                    Array.isArray(additionalInfoData) ? additionalInfoData : []
                );

                setCharacteristics(
                    Array.isArray(data.characteristics)
                        ? data.characteristics
                        : []
                );
            } catch (error) {
                console.error("Помилка при отриманні даних продукту:", error);
            }
        };
        fetchProductData();
    }, [productId]);

    const toggleDescription = () => {
        setDescriptionOpen(true);
        setCharacteristicsOpen(false);
    };

    const toggleCharacteristics = () => {
        setCharacteristicsOpen(true);
        setDescriptionOpen(false);
    };

    return (
        <div className="podrobniy-product-wrapper">
            <div className="podrobniy-product">
                <div className="titles-container">
                    <button
                        onClick={toggleDescription}
                        className={`clickable-link ${
                            isDescriptionOpen ? "active" : "inactive"
                        }`}
                    >
                        Опис
                    </button>
                    <button
                        onClick={toggleCharacteristics}
                        className={`clickable-link ${
                            isCharacteristicsOpen ? "active" : "inactive"
                        }`}
                    >
                        Властивість
                    </button>
                </div>

                {isDescriptionOpen && (
                    <div className="description-content">
                        {additionalInfo.length > 0 ? (
                            additionalInfo.map((info, index) => (
                                <p key={index}>{info}</p>
                            ))
                        ) : (
                            <p>Немає додаткової інформації</p>
                        )}
                    </div>
                )}

                {isCharacteristicsOpen && (
                    <div className="characteristics-content">
                        {characteristics.length > 0 ? (
                            <table className="characteristics-table">
                                <thead>
                                    <tr>
                                        <th>Властивість</th>
                                        <th>Значення</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {characteristics.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.characteristic_title}</td>
                                            <td>{item.option_title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Немає характеристик</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PodrobniyProduct;
