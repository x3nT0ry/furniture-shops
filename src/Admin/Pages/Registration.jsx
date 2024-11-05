import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "../Components/Contain/Container";
import "./Logging.css";
import Button from "../../Components/button/Button";
import backArrow from "../../Images/left-arrow.png";
import passwordIcon from "../../Images/password.png";
import loginIcon from "../../Images/login.png";

function Registration() {
    const [trustedCode, setTrustedCode] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        if (trustedCode === "123") {
            setIsCodeVerified(true);
            setError("");
        } else {
            setError("Невірний код довіреної особи");
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password.length < 5) {
            setError("Пароль має бути не менше 5 символів");
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login, password }),
            });
            const data = await response.json();
            if (data.success) {
                setRegistrationSuccess(true);
                setTimeout(() => {
                    navigate("/admin");
                }, 4000);
            } else {
                setError("Не вдалося зареєструватися, спробуйте ще раз");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Серверна помилка, спробуйте пізніше");
        }
    };

    return (
        <CenteredContainer>
            <div className="registration-container">
                {registrationSuccess ? (
                    <>
                        <div className="success-message">
                            Реєстрація успішно завершена!
                        </div>
                        <div className="return-message">
                            Автоматичне повернення до авторизації через 4
                            секунди...
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="back-link"
                            onClick={() => navigate("/admin")}
                        >
                            <img
                                src={backArrow}
                                alt="Back"
                                className="back-icon"
                            />
                            <div className="back-text">Повернутися</div>
                        </div>
                        {!isCodeVerified ? (
                            <form onSubmit={handleCodeSubmit}>
                                <div className="title">Код</div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={trustedCode}
                                        onChange={(e) =>
                                            setTrustedCode(e.target.value)
                                        }
                                        placeholder="Введіть код довіреної особи"
                                        required
                                        style={{ margin: "25px 0" }}
                                    />
                                </div>
                                {error && <div className="error">{error}</div>}
                                <Button type="submit" className="submit-button">
                                    Перевірити
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegisterSubmit}>
                                <div className="title">Реєстрація</div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="login"
                                        value={login}
                                        onChange={(e) =>
                                            setLogin(e.target.value)
                                        }
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
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Пароль"
                                        required
                                    />
                                    <img
                                        src={passwordIcon}
                                        alt="Toggle Password Visibility"
                                        className="input-icon"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                                {error && <div className="error">{error}</div>}
                                <Button type="submit" className="submit-button">
                                    Зареєструватися
                                </Button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </CenteredContainer>
    );
}

export default Registration;
