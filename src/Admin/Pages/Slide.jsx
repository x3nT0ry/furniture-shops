import React from "react";
import Admins from "../Components/Admin-header/admin-header";
import Navigation from "../Components/Navigation/navigation";
import "./Admin-panel.css";
import AdminSlider from "../Components/Slider/admin-slider";

export default function Admin() {
    return (
        <div className="admin-container1"> 
            <Admins />
            <Navigation className="navigation1" /> 
            <AdminSlider></AdminSlider>
        </div>
    );
}
