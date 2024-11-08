import React from "react";
import "./ProductsCard.css";
import { Link } from "react-router-dom";
import NoResult from "../finder/NoResult";

const baseURL = "http://localhost:3001"; 

export default function Products({ filteredProducts }) {
    if (!filteredProducts) {
        return <p>Немає продуктів для відображення.</p>;
    }

    return (
        <div className="furniture-wrapper">
            <div className="furniture-container">
                <ul className="products-list">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
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
