import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/header/Header";
import Footer from "../Components/footer/Footer";
import LineFurniture from "../Components/lineFurniture/LineFurniture";
import Photo from "../Components/lphoto/Photo";
import Products from "../Components/furniture/ProductsCard";
import Finder from "../Components/finder/Finder";
import Sorting from "../Components/sorting/Sorting";
import axios from "axios";
import Button from "../Components/button/Button";
import "../Components/furniture/Furniture.css";

export default function Furniture() {
    const location = useLocation();
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const finderRef = useRef();
    const sortingRef = useRef();

    const filterByCategory = (products, category) => {
        if (!category) return products;
        return products.filter(product => product.category === category);
    };

    const filterBySearch = (products, searchTerm) => {
        if (!searchTerm) return products;
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/products"
                );
                setOriginalProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const category = query.get("category");

        let filtered = filterByCategory(originalProducts, category);
        filtered = filterBySearch(filtered, searchTerm);

        setFilteredProducts(filtered);
        setSelectedCategory(category);
    }, [location.search, originalProducts, searchTerm]);

    const handleCategorySelect = (category) => {
        const filtered = filterByCategory(originalProducts, category);
        setFilteredProducts(filtered);
        setSelectedCategory(category);

        navigate(`/furniture?category=${category}`);
    };

    const handleResetFilters = () => {
        setFilteredProducts(originalProducts);
        setSelectedCategory(null);
        setSearchTerm("");

        if (finderRef.current) {
            finderRef.current.resetSearch();
        }

        if (sortingRef.current) {
            sortingRef.current.resetSorting();
        }

        navigate("/furniture");
    };

    const searchHandler = (term) => {
        setSearchTerm(term);
    };

    return (
        <>
            <Header />
            <LineFurniture
                onCategorySelect={handleCategorySelect}
                onResetFilters={handleResetFilters}
                selectedCategory={selectedCategory}
            />
            <Photo />
            <div className="wrapper-function">
                <div className="finder-sorting-container">
                    <div className="wrapper-function-item">
                        <Finder ref={finderRef} onSearch={searchHandler} />
                    </div>
                    <div className="wrapper-function-item">
                        <Button
                            onClick={handleResetFilters}
                            style={{ width: "100%" }}
                        >
                            Скинути всі фільтри
                        </Button>
                    </div>
                    <div className="wrapper-function-item">
                        <Sorting
                            ref={sortingRef}
                            setFilteredProducts={setFilteredProducts}
                            originalProducts={originalProducts}
                        />
                    </div>
                </div>
            </div>
            <Products filteredProducts={filteredProducts} />
            <Footer />
        </>
    );
}
