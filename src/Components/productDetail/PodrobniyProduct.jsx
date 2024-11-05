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

                const info = response.data.additionalInfo;
                console.log("Raw additionalInfo:", info);

                if (typeof info === "string") {
                    try {
                        const parsedInfo = JSON.parse(info);
                        if (Array.isArray(parsedInfo)) {
                            setAdditionalInfo(parsedInfo);
                        } else {
                            console.error(
                                "Parsed additionalInfo is not an array:",
                                parsedInfo
                            );
                            setAdditionalInfo([]);
                        }
                    } catch (error) {
                        console.error("Error parsing additionalInfo:", error);
                        setAdditionalInfo([]);
                    }
                } else if (Array.isArray(info)) {
                    setAdditionalInfo(info);
                } else {
                    setAdditionalInfo([]);
                }

                let tablesData = response.data.tables;
                if (typeof tablesData === "string") {
                    try {
                        tablesData = JSON.parse(tablesData);
                    } catch (error) {
                        console.error("Error parsing tables data:", error);
                    }
                }

                if (Array.isArray(tablesData)) {
                    setCharacteristics(tablesData);
                } else {
                    console.error("Tables data is not an array:", tablesData);
                    setCharacteristics([]);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchProductData();
    }, [productId]);

    const toggleDescription = () => {
        setDescriptionOpen((prev) => !prev);
        if (isCharacteristicsOpen) setCharacteristicsOpen(false);
    };

    const toggleCharacteristics = () => {
        setCharacteristicsOpen((prev) => !prev);
        if (isDescriptionOpen) setDescriptionOpen(false);
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
                        Характеристики
                    </button>
                </div>

                {isDescriptionOpen && (
                    <div className="description-content">
                        {Array.isArray(additionalInfo) &&
                        additionalInfo.length > 0 ? (
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
                        <table className="characteristics-table">
                            <thead>
                                <tr>
                                    <th>Характеристика</th>
                                    <th>Значення</th>
                                </tr>
                            </thead>
                            <tbody>
                                {characteristics.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.left}</td>
                                        <td>{item.right}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PodrobniyProduct;
