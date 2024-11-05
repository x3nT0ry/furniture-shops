import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import searchIcon from '../../Images/search.png'; 
import './Finder.css'; 

const Finder = forwardRef(({ onSearch }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null); 
    const [isFocused, setIsFocused] = useState(false); 

    useImperativeHandle(ref, () => ({
        resetSearch() {
            setSearchTerm('');
            onSearch(''); 
        }
    }));

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); 
    };

    const handleFocus = () => {
        setIsFocused(true); 
        inputRef.current.focus(); 
    };

    const handleBlur = () => {
        if (searchTerm === '') {
            setIsFocused(false); 
        }
    };

    const handleIconClick = () => {
        inputRef.current.focus(); 
    };

    return (
        <div className="finder-container">
            <img 
                src={searchIcon} 
                alt="Search" 
                className="search-icon" 
                onClick={handleIconClick} 
            />
            <input
                type="text"
                ref={inputRef} 
                value={searchTerm}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={isFocused || searchTerm ? "Шукати..." : "Пошук товарів"} 
                className={`finder-input ${isFocused ? 'focused' : ''}`} 
            />
        </div>
    );
});

export default Finder;
