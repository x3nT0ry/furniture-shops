import React, { useState } from "react";
import "./ContactForm.css";
import Button from "../button/Button";
import backArrow from "../../Images/left-arrow.png";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "+380 ",
        country: "",
        city: "",
        question: "",
        tracking_code: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/[^0-9]/g, "");
        const withoutCode = cleaned.slice(3);

        const match = withoutCode.match(
            /^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,3})$/
        );

        if (match) {
            return `+380 (${match[1] || ""}) ${match[2] || ""} ${
                match[3] || ""
            } ${match[4] || ""}`;
        }

        return value;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            if (
                value.startsWith("+380") &&
                value.replace(/[^0-9]/g, "").length <= 12
            ) {
                const formattedPhone = formatPhoneNumber(value);
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: formattedPhone,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaValue) {
            alert("Будь ласка, підтверджте, що ви не робот.");
            return;
        }

        const updatedFormData = {
            ...formData,
            phone: formData.phone.replace("+", ""),
            tracking_code: formData.tracking_code || 0,
            captchaToken: captchaValue,
        };

        try {
            const response = await fetch("http://localhost:3001/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                const data = await response.json();
                setIsSubmitted(true);

                setTimeout(() => {
                    setIsSubmitted(false);
                    navigate("/furniture");
                }, 4000);
            } else {
                const errorData = await response.json();
                alert(`Помилка: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Виникла помилка при відправці запиту.");
        }
    };

    return (
        <div className="form-wrapper">
            {isSubmitted ? (
                <div>
                    <div
                        className="back-link1"
                        onClick={() => navigate("/furniture")}
                    >
                        <img
                            src={backArrow}
                            alt="Back"
                            className="back-icon1"
                        />
                        <div className="back-text1">Повернутися до товарів</div>
                    </div>
                    <div className="thank-you-message">
                        Дякуємо! Ваш запит був надісланий. Ми обов'язково
                        відповімо вам у найближчий час! Відповідь надійде на
                        пошту або ми зателефонуємо вам!
                    </div>
                    <div className="return-message2">
                        Повернення через 4 секунди...
                    </div>
                </div>
            ) : (
                <div>
                    <div className="contact-form-title">Contact</div>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-column">
                            <div className="form-label">
                                <label>Ім'я:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Ваше ім'я"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-label">
                                <label>Прізвище:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Ваше прізвище"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-label">
                                <label>Електронна пошта:</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="johndoe@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-label">
                                <label>Номер телефону:</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="phone-input"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-label">
                                <label>Країна:</label>
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Ваша країна"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-label">
                                <label>Місто:</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Ваше місто"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-label">
                                <label>Ваше питання:</label>
                                <textarea
                                    name="question"
                                    placeholder="Ваше питання або коментар..."
                                    required
                                    value={formData.question}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="form-label">
                                <label>Трекінговий код(При наявності):</label>
                                <input
                                    type="text"
                                    name="tracking_code"
                                    placeholder="Ваш трекінговий код"
                                    value={formData.tracking_code}
                                    onChange={handleChange}
                                />
                            </div>
                            <ReCAPTCHA
                                sitekey="6LfbU3YqAAAAAGra63jtaxuA2io1rw3MwC9Qz6uF"
                                onChange={handleCaptchaChange}
                            />
                            <div>
                                <Button
                                    type="submit"
                                    disabled={!captchaValue}
                                    style={{ marginTop: "15px" }}
                                >
                                    Відправити запит
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
