import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "../Components/slider/Slider";
import Header from "../Components/header/Header";
import Line from "../Components/line/Line";
import Footer from "../Components/footer/Footer";

export default function Home() {
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        navigate(`/furniture?category=${category}`);
    };

    return (
        <>
            <Header />
            <Slider />
            <Line onCategorySelect={handleCategorySelect} />
            <Footer />
        </>
    );
}
