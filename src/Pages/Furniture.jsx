import React, { useEffect, useState, useRef } from "react"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import Header from "../Components/header/Header";
import Footer from "../Components/footer/Footer";
import LineFurniture from "../Components/lineFurniture/LineFurniture";
import Photo from "../Components/lphoto/Photo";
import Products from "../Components/furniture/ProductsCard";
import Finder from "../Components/finder/Finder";
import Sorting from "../Components/sorting/Sorting";
import { filterByCategory } from "../Components/furniture/Function"; 
import axios from 'axios';
import Button from "../Components/button/Button";
import "../Components/furniture/Furniture.css";

export default function Furniture() {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [filteredProducts, setFilteredProducts] = useState([]); 
    const [originalProducts, setOriginalProducts] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSorting, setSelectedSorting] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const finderRef = useRef();
    const sortingRef = useRef();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
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

        if (category) {
            filterByCategory(originalProducts, setFilteredProducts)(category); 
            setSelectedCategory(category);
        } else {
            setFilteredProducts(originalProducts); 
            setSelectedCategory(null);
        }
    }, [location.search, originalProducts]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = originalProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(originalProducts); 
        }
    }, [searchTerm, originalProducts]); 

    const handleCategorySelect = (category) => {
        filterByCategory(originalProducts, setFilteredProducts)(category);
        setSelectedCategory(category);
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

        navigate('/furniture');
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
                        <Button onClick={handleResetFilters}>
                            Скинути всі фільтри
                        </Button>
                    </div>
                    <div className="wrapper-function-item">
                        <Sorting
                            ref={sortingRef}
                            setFilteredProducts={setFilteredProducts}
                            originalProducts={originalProducts}
                            selectedSorting={selectedSorting}
                            setSelectedSorting={setSelectedSorting}
                        />
                    </div>
                </div>
            </div>
            <Products filteredProducts={filteredProducts} searchTerm={searchTerm} />
            <Footer />
        </>
    );
}
