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
import Filter from "../Components/filter/Filter";

export default function Furniture() {
    const location = useLocation();
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    const finderRef = useRef();
    const sortingRef = useRef();
    const filterRef = useRef();

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        }
    }, [filteredProducts, currentPage, totalPages]);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let products;

                if (
                    Object.keys(selectedFilters).length > 0 ||
                    searchTerm ||
                    selectedCategory
                ) {
                    const requestBody = { filters: selectedFilters };

                    if (searchTerm) {
                        requestBody.searchTerm = searchTerm;
                    }

                    if (selectedCategory) {
                        requestBody.category = selectedCategory;
                    }

                    const response = await axios.post(
                        "http://localhost:3001/api/products/filter",
                        requestBody
                    );
                    products = response.data;
                } else {
                    const response = await axios.get(
                        "http://localhost:3001/api/products"
                    );
                    products = response.data;
                }

                setOriginalProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [selectedFilters, searchTerm, selectedCategory]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const category = query.get("category");

        setSelectedCategory(category);
    }, [location.search]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        navigate(`/furniture?category=${category}`);
    };

    const handleResetFilters = () => {
        setFilteredProducts(originalProducts);
        setSelectedCategory(null);
        setSearchTerm("");
        setSelectedFilters({});
        setCurrentPage(1);

        if (finderRef.current) {
            finderRef.current.resetSearch();
        }

        if (sortingRef.current) {
            sortingRef.current.resetSorting();
        }

        if (filterRef.current) {
            filterRef.current.resetFilters();
        }

        navigate("/furniture");
    };

    const searchHandler = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilterChange = (newFilters) => {
        setSelectedFilters(newFilters);
        setCurrentPage(1);
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
            <div className="tovargrid">
                <div className="filter-container1">
                    <Filter
                        ref={filterRef}
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <div className="products-container1">
                    <Products filteredProducts={currentProducts} />
                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={`page-btn ${
                                        currentPage === index + 1
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
