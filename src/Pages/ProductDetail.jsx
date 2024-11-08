import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Components/productDetail/ProductDetail.css";
import Header from "../Components/header/Header";
import Footer from "../Components/footer/Footer";
import Navigation from "../Components/productDetail/navigation";
import ImageMains from "../Components/productDetail/main-photo";
import ProductInfo from "../Components/productDetail/Product-info";
import PodrobniyProduct from "../Components/productDetail/PodrobniyProduct";
import axios from "axios";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/card/${id}`
                );
                setProduct(response.data);
            } catch (error) {
                console.error("Помилка при отриманні продукту:", error);
                setProduct(null);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div>Товар не знайдено!</div>;
    }

    return (
        <>
            <Header />
            <Navigation product={product} />
            <div className="product-detail-container">
                <ImageMains product={product} />
                <div className="product-counter-wrapper">
                    <ProductInfo productId={product.id_products} />
                </div>
            </div>
            <PodrobniyProduct productId={product.id_products} />
            <Footer />
        </>
    );
}
