import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import axios from "axios";
import "./Filter.css";
import downArrow from "../../Images/down.png";
import upArrow from "../../Images/up.png";

const Filter = forwardRef(({ onFilterChange }, ref) => {
    const [availableCharacteristics, setAvailableCharacteristics] = useState(
        []
    );
    const [selectedOptions, setSelectedOptions] = useState({});
    const [expandedFilters, setExpandedFilters] = useState({});
    const filterRef = useRef(null);

    useImperativeHandle(ref, () => ({
        resetFilters() {
            setSelectedOptions({});
            onFilterChange({});
        },
    }));

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/characteristics"
                );
                setAvailableCharacteristics(response.data);

                const initialExpandedFilters = response.data.reduce(
                    (acc, char) => {
                        acc[char.id] = true;
                        return acc;
                    },
                    {}
                );
                setExpandedFilters(initialExpandedFilters);
            } catch (error) {
                console.error("Error fetching characteristics:", error);
            }
        };

        fetchCharacteristics();
    }, []);

    const handleCheckboxChange = (charId, optionId, isChecked) => {
        setSelectedOptions((prevSelectedOptions) => {
            const optionsForChar = prevSelectedOptions[charId] || [];

            let newOptionsForChar;
            if (isChecked) {
                newOptionsForChar = [...optionsForChar, optionId];
            } else {
                newOptionsForChar = optionsForChar.filter(
                    (id) => id !== optionId
                );
            }

            const newSelectedOptions = {
                ...prevSelectedOptions,
                [charId]: newOptionsForChar,
            };

            if (newOptionsForChar.length === 0) {
                delete newSelectedOptions[charId];
            }

            onFilterChange(newSelectedOptions);

            return newSelectedOptions;
        });
    };

    const toggleFilterVisibility = (charId) => {
        setExpandedFilters((prevExpandedFilters) => ({
            ...prevExpandedFilters,
            [charId]: !prevExpandedFilters[charId],
        }));
    };

    useEffect(() => {
        const fetchAvailableCharacteristics = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:3001/api/available-options",
                    { selectedOptions }
                );
                setAvailableCharacteristics(response.data);
            } catch (error) {
                console.error(
                    "Error fetching available characteristics:",
                    error
                );
            }
        };

        fetchAvailableCharacteristics();
    }, [selectedOptions]);

    useEffect(() => {
        setSelectedOptions((prevSelectedOptions) => {
            const newSelectedOptions = {};
            availableCharacteristics.forEach((char) => {
                if (prevSelectedOptions[char.id]) {
                    const availableOptionIds = char.options.map(
                        (option) => option.id
                    );
                    const updatedOptions = prevSelectedOptions[char.id].filter(
                        (optionId) => availableOptionIds.includes(optionId)
                    );
                    if (updatedOptions.length > 0) {
                        newSelectedOptions[char.id] = updatedOptions;
                    }
                }
            });
            if (
                JSON.stringify(newSelectedOptions) !==
                JSON.stringify(prevSelectedOptions)
            ) {
                onFilterChange(newSelectedOptions);
            }
            return newSelectedOptions;
        });
    }, [availableCharacteristics, onFilterChange]);

    useEffect(() => {
        const filterElement = filterRef.current;
        const footerElement = document.querySelector(".footer");

        if (!filterElement || !footerElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    filterElement.classList.add("filter--above-footer");
                } else {
                    filterElement.classList.remove("filter--above-footer");
                }
            },
            {
                root: null,
                threshold: 0,
            }
        );

        observer.observe(footerElement);

        return () => {
            observer.unobserve(footerElement);
        };
    }, []);

    return (
        <div ref={filterRef} className="filter">
            {availableCharacteristics.map((char) => {
                if (!char.options || char.options.length === 0) {
                    return null;
                }
                return (
                    <div key={char.id} className="filter-characteristic">
                        <div
                            className="filter-header"
                            onClick={() => toggleFilterVisibility(char.id)}
                        >
                            <h4
                                className="filter-title"
                                style={{ userSelect: "none" }}
                            >
                                {char.title}
                            </h4>
                            <img
                                src={
                                    expandedFilters[char.id]
                                        ? upArrow
                                        : downArrow
                                }
                                alt="toggle arrow"
                                className={`filter-toggle-icon ${
                                    expandedFilters[char.id] ? "open" : ""
                                }`}
                                style={{ userSelect: "none" }}
                            />
                        </div>
                        <div
                            className={`filter-options ${
                                expandedFilters[char.id] ? "open" : ""
                            }`}
                        >
                            {char.options.map((option) => (
                                <div key={option.id} className="filter-option">
                                    <input
                                        type="checkbox"
                                        id={`option-${option.id}`}
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                char.id,
                                                option.id,
                                                e.target.checked
                                            )
                                        }
                                        checked={
                                            selectedOptions[char.id]?.includes(
                                                option.id
                                            ) || false
                                        }
                                    />
                                    <label
                                        htmlFor={`option-${option.id}`}
                                        className="custom-label"
                                        style={{ userSelect: "none" }}
                                    >
                                        {option.title} ({option.productCount})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default Filter;
