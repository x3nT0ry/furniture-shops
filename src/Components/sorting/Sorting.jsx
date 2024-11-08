import React, { useImperativeHandle, forwardRef, useState } from "react";
import "./Sorting.css";
import axios from "axios";

const Sorting = forwardRef(({ setFilteredProducts, originalProducts }, ref) => {
    const [sortValue, setSortValue] = useState("");

    const handleSortChangeInternal = async (event) => {
        const value = event.target.value;
        setSortValue(value);

        if (value === "") {
            setFilteredProducts(originalProducts);
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:3001/api/sorts?sort=${value}`
            );
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching sorted products:", error);
        }
    };

    const resetSorting = () => {
        setSortValue("");
        setFilteredProducts(originalProducts);
    };

    useImperativeHandle(ref, () => ({
        resetSorting,
    }));

    return (
        <div className="sorting-container">
            <select
                id="sort"
                className="unique-select"
                value={sortValue}
                onChange={handleSortChangeInternal}
            >
                <option value="">Сортування по ціні</option>
                <option value="asc">
                    Від мінімальної ціни до максимальної
                </option>
                <option value="desc">
                    Від максимальної ціни до мінімальної
                </option>
            </select>
        </div>
    );
});

export default Sorting;
