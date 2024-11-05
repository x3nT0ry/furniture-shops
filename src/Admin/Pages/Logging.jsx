import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/auth/AuthContext";
import Button from "../../Components/button/Button";
import CenteredContainer from "../Components/Contain/Container";
import "./Logging.css";
import loginIcon from "../../Images/login.png";
import passwordIcon from "../../Images/password.png";

function Logging() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login: authenticate } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:3001/api/checkpass",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ login, password }),
                }
            );

            const data = await response.json();
            if (data.success) {
                authenticate();
                navigate("/admin-panel");
            } else {
                setError("Невірний логін або пароль");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Server error, please try again later");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <CenteredContainer>
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <div className="title">Авторизація</div>
                    <div className="input-group">
                        <input
                            type="texts"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Логін"
                            required
                        />
                        <img
                            src={loginIcon}
                            alt="Login Icon"
                            className="input-icon"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                        />
                        <img
                            src={passwordIcon}
                            alt="Password Icon"
                            className="input-icon"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <Button type="submit">Увійти</Button>
                
                </form>
            </div>
        </CenteredContainer>
    );
}

export default Logging;
