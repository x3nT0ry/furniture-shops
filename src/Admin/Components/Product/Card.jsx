import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Request/Request.css";

const Card = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/api/getProducts"
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Ошибка при получении продуктов:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteClick = async () => {
        if (selectedProducts.length > 0) {
            try {
                await Promise.all(
                    selectedProducts.map((product) =>
                        axios.delete(
                            `http://localhost:3001/api/deleteCard/${product.id}`
                        )
                    )
                );
                setProducts((prevProducts) =>
                    prevProducts.filter(
                        (product) =>
                            !selectedProducts.some(
                                (selected) => selected.id === product.id
                            )
                    )
                );
                setSelectedProducts([]);
            } catch (error) {
                console.error("Error deleting products:", error);
            }
        }
    };

    const handleEditClick = (productId) => {
        navigate(`/admin-panel/product/${productId}`);
    };

    const handleCheckboxChange = (product) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.some((selected) => selected.id === product.id)) {
                return prevSelected.filter(
                    (selected) => selected.id !== product.id
                );
            } else {
                return [...prevSelected, product];
            }
        });
    };

    const handleRowClick = (product) => {
        handleCheckboxChange(product);
    };

    const baseURL = "http://localhost:3001";

    const formatPrice = (price) => {
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн`;
    };

    return (
        <div className="request-wrapper">
            <div className="button-group">
                <button
                    className="button"
                    onClick={() => navigate(`/newproduct/${Date.now()}`)}
                >
                    Додати
                </button>
                {selectedProducts.length > 0 && (
                    <button className="button" onClick={handleDeleteClick}>
                        Видалити
                    </button>
                )}
            </div>

            <div className="table-container">
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Обрати</th>
                            <th>Назва</th>
                            <th>Ціна</th>
                            <th>Картинка</th>
                            <th>Картинка при наведенні</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products
                            .slice(0)
                            .reverse()
                            .map((product, index) => (
                                <tr
                                    key={`${product.id}-${index}`}
                                    onClick={() => handleRowClick(product)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.some(
                                                (selected) =>
                                                    selected.id === product.id
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(product)
                                            }
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>
                                        <img
                                            src={`${baseURL}${product.image}`}
                                            alt="product"
                                            style={{
                                                width: "auto",
                                                height: "80px",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            src={`${baseURL}${product.hoverImage}`}
                                            alt="hover product"
                                            style={{
                                                width: "auto",
                                                height: "80px",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className="details-button"
                                            onClick={() =>
                                                handleEditClick(product.id)
                                            }
                                        >
                                            Змінити
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Card;
