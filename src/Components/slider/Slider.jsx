import React, { useState, useEffect } from "react";
import "./Slider.css";
import leftArrow from "../../Images/arrow-left.png";
import rightArrow from "../../Images/arrow-right.png";

export default function Slider() {
    const [slides, setSlides] = useState([]); 
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/sliders");
                const data = await response.json();
                setSlides(data); 
            } catch (error) {
                console.error("Помилка завантаження слайдів:", error);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        const sliderInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 13000);
        return () => clearInterval(sliderInterval);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        <div className="slider-container">
            <div className="slider-image">
                <img
                    src={leftArrow}
                    alt="Previous"
                    className="arrow left-arrow"
                    onClick={goToPrevious}
                />
                {slides.map((slide, index) => (
                    <img
                        key={slide.id_slider}
                        src={`http://localhost:3001/images/slider/${slide.image}`}
                        alt={`Slide ${index + 1}`}
                        className={`slide ${index === currentIndex ? "active" : ""}`}
                    />
                ))}
                <img
                    src={rightArrow}
                    alt="Next"
                    className="arrow right-arrow"
                    onClick={goToNext}
                />
            </div>
            <div className="text-overlay">
                <div className="text-background" />
                {slides.length > 0 && (
                    <>
                        <h1>{slides[currentIndex].title}</h1>
                        <div className="text">{slides[currentIndex].description}</div>
                    </>
                )}
            </div>
            <div className="dots-container">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}
