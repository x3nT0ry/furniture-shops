import React, { useEffect, useState } from "react";
import "./ProductsCard.css";
import { Link, useLocation } from "react-router-dom";
import NoResult from "../finder/NoResult";
import axios from "axios";

const baseURL = "http://localhost:3001"; 

export default function Products({ searchTerm }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProductsList, setFilteredProductsList] = useState([]); 

    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/products`);
                setProducts(response.data); 
                setLoading(false);
            } catch (err) {
                setError("Помилка при завантаженні продуктів");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); 

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get("category");

        let filtered = products;

        if (category) {
            filtered = products.filter(product => 
                product.category.toLowerCase() === category.toLowerCase()
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProductsList(filtered);
    }, [products, searchTerm, location.search]); 

    if (loading) {
        return <p>Завантаження...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="furniture-wrapper">
            <div className="furniture-container">
                <ul className="products-list">
                    {filteredProductsList.length > 0 ? (
                        filteredProductsList.map((product) => (
                            <li key={product.id_products} className="product-item">
                                <Link to={`/furniture/${product.id_products}`} className="image-link">
                                    <div className="image-container">
                                        <img 
                                            src={`${baseURL}${product.image}`} 
                                            alt={product.name} 
                                            className="product-image" 
                                            width="50" 
                                        />
                                        <img 
                                            src={`${baseURL}${product.hoverImage}`} 
                                            alt={product.name} 
                                            className="hover-image" 
                                            width="50" 
                                        />
                                    </div>
                                </Link>
                                <Link to={`/furniture/${product.id_products}`} className="product-name">
                                    {product.name}
                                </Link>
                                <p className="product-price2">{product.price.toLocaleString('uk-UA')} грн</p>
                            </li>
                        ))
                    ) : (
                        <NoResult />
                    )}
                </ul>
            </div>
        </div>
    );
}
