import React from "react";
import Admins from "../Components/Admin-header/admin-header";
import Navigation from "../Components/Navigation/navigation";
import "./Admin-panel.css";
import NewCharacteristic from "../Components/Characteristc/NewCharacteristic";

export default function Characteristic() {
    return (
        <div className="admin-container1"> 
            <Admins />
            <Navigation className="navigation1" /> 
            <NewCharacteristic></NewCharacteristic>
        </div>
    );
}
