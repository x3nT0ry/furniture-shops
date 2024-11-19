import React, { useState, useContext, useRef, useEffect } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import ukraineFlag from "../../Images/ukraine.png";
import axios from "axios";
import "./CheckOut.css";
import Button from "../../Components/button/Button";

import {
    PayPalScriptProvider,
    PayPalButtons,
    FUNDING,
} from "@paypal/react-paypal-js";

const API_KEY = "5ebbf56634a2a7335d8f20adc5c64c81";

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [shippingMethod] = useState("Нова пошта");
    const [city, setCity] = useState("");
    const [department, setDepartment] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [telegram, setTelegram] = useState("");
    const [errors, setErrors] = useState({});
    const [exchangeRate, setExchangeRate] = useState(null);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [showDepartmentSuggestions, setShowDepartmentSuggestions] =
        useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();

    const formatPhoneNumber = (value) => {
        let cleaned = value.replace(/[^+\d]/g, "");

        if (!cleaned.startsWith("+380")) {
            cleaned = "+380" + cleaned.replace(/^\+?380/, "");
        }

        let digits = cleaned.slice(4).replace(/\s+/g, "").slice(0, 9);

        let formatted = "+380 ";
        for (let i = 0; i < digits.length; i++) {
            if (i === 2 || i === 4 || i === 6) {
                formatted += " ";
            }
            formatted += digits[i];
        }

        return formatted;
    };

    const formValuesRef = useRef({
        shippingMethod: "Нова пошта",
        city: "",
        department: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        telegram: "",
    });

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await axios.get(
                    "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
                );
                const usdRateData = response.data.find(
                    (rate) => rate.cc === "USD"
                );
                if (usdRateData) {
                    const rate = parseFloat(usdRateData.rate);
                    if (!isNaN(rate) && rate > 0) {
                        setExchangeRate(rate);
                        console.log(
                            `Текущий курс гривны к доллару США: 1 USD = ${rate} UAH`
                        );
                    } else {
                        console.error(
                            "Отримано некоректний курс USD від NBU API"
                        );
                    }
                } else {
                    console.error("USD курс не знайдено в відповіді NBU API");
                }
            } catch (error) {
                console.error(
                    "Помилка при отриманні курсу валюти з NBU API:",
                    error
                );
            }
        };

        fetchExchangeRate();
    }, []);

    const validateFields = () => {
        const newErrors = {};
        const {
            shippingMethod,
            city,
            department,
            firstName,
            lastName,
            phone,
            email,
        } = formValuesRef.current;

        if (!shippingMethod.trim()) {
            newErrors.shippingMethod = "Спосіб доставки обов'язковий";
        }
        if (!city.trim()) {
            newErrors.city = "Місто обов'язкове";
        }
        if (!department.trim()) {
            newErrors.department = "Відділення обов'язкове";
        }
        if (!firstName.trim()) {
            newErrors.firstName = "Ім'я обов'язкове";
        }
        if (!lastName.trim()) {
            newErrors.lastName = "Прізвище обов'язкове";
        }
        if (!phone.trim()) {
            newErrors.phone = "Телефон обов'язковий";
        }
        if (!email.trim()) {
            newErrors.email = "Пошта обов'язкова";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = "Невірний формат пошти";
            }
        }
        if (!paymentMethod) {
            newErrors.paymentMethod = "Спосіб оплати обов'язковий";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const constructOrderData = () => {
        const sanitizedItems = cartItems.map((item) => ({
            productId: item.id,
            quantity: parseInt(item.quantity, 10) || 1,
            price: parseFloat(item.price) || 0,
        }));

        return {
            shippingMethod: formValuesRef.current.shippingMethod,
            city: formValuesRef.current.city,
            department: formValuesRef.current.department,
            firstName: formValuesRef.current.firstName,
            lastName: formValuesRef.current.lastName,
            phone: formValuesRef.current.phone,
            email: formValuesRef.current.email,
            telegram: formValuesRef.current.telegram,
            items: sanitizedItems,
            paymentstatus: paymentMethod === "pay_now" ? 1 : 2,
        };
    };

    const handleSubmit = async () => {
        const orderData = constructOrderData();

        try {
            const response = await axios.post(
                "http://localhost:3001/api/orders",
                orderData
            );

            if (response.status === 200) {
                clearCart();

                const { orderId, total } = response.data;

                navigate("/order-confirmation", {
                    state: { order: { id: orderId, total } },
                });
            }
        } catch (error) {
            console.error("Помилка при оформленні замовлення:", error);
            alert(
                "Сталася помилка при оформленні замовлення. Спробуйте ще раз."
            );
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (validateFields()) {
            await handleSubmit();
        }
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);
        formValuesRef.current.city = value;

        if (value.length >= 2) {
            fetchCities(value);
            setShowCitySuggestions(true);
        } else {
            setCitySuggestions([]);
            setShowCitySuggestions(false);
        }

        if (errors.city) {
            setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
        }
    };

    const handleDepartmentChange = (e) => {
        const value = e.target.value;
        setDepartment(value);
        formValuesRef.current.department = value;

        if (value.length >= 1 && city) {
            fetchDepartments(city, value);
            setShowDepartmentSuggestions(true);
        } else {
            setDepartmentSuggestions([]);
            setShowDepartmentSuggestions(false);
        }

        if (errors.department) {
            setErrors((prevErrors) => ({ ...prevErrors, department: "" }));
        }
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
        formValuesRef.current.firstName = e.target.value;
        if (errors.firstName) {
            setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
        }
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
        formValuesRef.current.lastName = e.target.value;
        if (errors.lastName) {
            setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
        }
    };

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const formattedPhone = formatPhoneNumber(inputValue);

        if (formattedPhone.length <= 18) {
            setPhone(formattedPhone);
            formValuesRef.current.phone = formattedPhone;
        }

        if (errors.phone) {
            setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        formValuesRef.current.email = e.target.value;
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        }
    };

    const handleTelegramChange = (e) => {
        setTelegram(e.target.value);
        formValuesRef.current.telegram = e.target.value;
    };

    const fetchCities = async (query) => {
        try {
            const response = await axios.post(
                "https://api.novaposhta.ua/v2.0/json/",
                {
                    apiKey: API_KEY,
                    modelName: "Address",
                    calledMethod: "getCities",
                    methodProperties: {
                        FindByString: query,
                        Limit: 10,
                    },
                }
            );

            if (response.data && response.data.data) {
                setCitySuggestions(response.data.data);
            }
        } catch (error) {
            console.error("Помилка при отриманні міст:", error);
        }
    };

    const fetchDepartments = async (cityName, query) => {
        try {
            const response = await axios.post(
                "https://api.novaposhta.ua/v2.0/json/",
                {
                    apiKey: API_KEY,
                    modelName: "AddressGeneral",
                    calledMethod: "getWarehouses",
                    methodProperties: {
                        CityName: cityName,
                        FindByString: query,
                        Limit: 10,
                    },
                }
            );

            if (response.data && response.data.data) {
                setDepartmentSuggestions(response.data.data);
            }
        } catch (error) {
            console.error("Помилка при отриманні відділень:", error);
        }
    };

    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity.Description);
        formValuesRef.current.city = selectedCity.Description;
        setCitySuggestions([]);
        setShowCitySuggestions(false);
    };

    const handleDepartmentSelect = (selectedDept) => {
        setDepartment(`${selectedDept.Number} - ${selectedDept.Description}`);
        formValuesRef.current.department = `${selectedDept.Number} - ${selectedDept.Description}`;
        setDepartmentSuggestions([]);
        setShowDepartmentSuggestions(false);
    };

    return (
        <div className="checkout-container">
            <div className="pay-delivery-title">Check Out</div>

            <div className="checkout-flex">
                <div className="checkout-left">
                    <form onSubmit={handleFormSubmit} style={{ gap: "30px" }}>
                        <div className="section-title">1. Спосіб доставки</div>
                        <input type="texts" value={shippingMethod} readOnly />
                        {errors.shippingMethod && (
                            <div className="error">{errors.shippingMethod}</div>
                        )}

                        <div className="input-wrapper">
                            <div className="input-container">
                                <input
                                    type="texts"
                                    value={city}
                                    onChange={handleCityChange}
                                    onBlur={() =>
                                        setTimeout(
                                            () => setShowCitySuggestions(false),
                                            100
                                        )
                                    }
                                    required
                                    autoComplete="off"
                                    placeholder="Місто"
                                />
                                <span className="input-arrows"></span>{" "}
                                {showCitySuggestions &&
                                    citySuggestions.length > 0 && (
                                        <ul className="suggestions-list">
                                            {citySuggestions.map((cityItem) => (
                                                <li
                                                    key={cityItem.Ref}
                                                    onClick={() =>
                                                        handleCitySelect(
                                                            cityItem
                                                        )
                                                    }
                                                >
                                                    {cityItem.Description}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                            {errors.city && (
                                <div className="error">{errors.city}</div>
                            )}
                        </div>

                        <div className="input-wrapper">
                            <div className="input-container">
                                <input
                                    type="texts"
                                    value={department}
                                    onChange={handleDepartmentChange}
                                    onBlur={() =>
                                        setTimeout(
                                            () =>
                                                setShowDepartmentSuggestions(
                                                    false
                                                ),
                                            100
                                        )
                                    }
                                    required
                                    autoComplete="off"
                                    placeholder="Відділення"
                                />
                                <span className="input-arrows"></span>{" "}
                                {showDepartmentSuggestions &&
                                    departmentSuggestions.length > 0 && (
                                        <ul className="suggestions-list">
                                            {departmentSuggestions.map(
                                                (dept) => (
                                                    <li
                                                        key={dept.Number}
                                                        onClick={() =>
                                                            handleDepartmentSelect(
                                                                dept
                                                            )
                                                        }
                                                    >
                                                        {`${dept.Number} - ${dept.Description}`}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                            </div>
                            {errors.department && (
                                <div className="error">{errors.department}</div>
                            )}
                        </div>

                        <div className="section-title">
                            2. Персональна інформація
                        </div>
                        <input
                            type="texts"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            required
                            placeholder="Ім'я"
                        />
                        {errors.firstName && (
                            <div className="error">{errors.firstName}</div>
                        )}
                        <input
                            type="texts"
                            value={lastName}
                            onChange={handleLastNameChange}
                            required
                            placeholder="Прізвище"
                        />
                        {errors.lastName && (
                            <div className="error">{errors.lastName}</div>
                        )}
                        <div className="input-wrapper">
                            <img
                                src={ukraineFlag}
                                alt="Україна"
                                className="flag-icon"
                            />

                            <input
                                type="texts"
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                                placeholder="Номер телефону"
                                maxLength={17}
                                className="phone-inputs"
                            />
                        </div>

                        {errors.phone && (
                            <div className="error">{errors.phone}</div>
                        )}
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            placeholder="Електронна пошта"
                        />
                        {errors.email && (
                            <div className="error">{errors.email}</div>
                        )}
                        <input
                            type="texts"
                            value={telegram}
                            onChange={handleTelegramChange}
                            placeholder="Назва телеграм-аккаунта (при наявності)"
                        />
                    </form>
                </div>

                <div className="checkout-right">
                    <div className="section-title1">Деталі замовлення</div>
                    <div className="order-details">
                        {cartItems.map((item) => (
                            <div className="detail-order" key={item.id}>
                                <div className="order-item-info">
                                    <span className="item-name">
                                        {item.name}
                                    </span>{" "}
                                    x {item.quantity}
                                </div>

                                <div className="order-item-price">
                                    {`${(
                                        item.price * item.quantity
                                    ).toLocaleString("uk-UA")} ₴`}
                                </div>
                            </div>
                        ))}

                        <hr />

                        <div className="total-price">
                            <div className="total-text">
                                До сплати:{" "}
                                <div
                                    className="price"
                                    style={{ fontWeight: "normal" }}
                                >
                                    {totalPrice.toLocaleString("uk-UA")} ₴
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="payment-method-options">
                        <div className="section-title1">Спосіб оплати</div>
                        <div className="attr">
                            <div
                                className={`payment-option ${
                                    paymentMethod === "pay_now" ? "active" : ""
                                }`}
                                onClick={() => setPaymentMethod("pay_now")}
                            >
                                <div className="payment-option-label">
                                    Повна сплата
                                </div>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="pay_now"
                                    checked={paymentMethod === "pay_now"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    id="pay_now"
                                />
                            </div>
                            <div
                                className={`payment-option ${
                                    paymentMethod === "pay_on_delivery"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setPaymentMethod("pay_on_delivery")
                                }
                            >
                                <div className="payment-option-label">
                                    Накладний платіж
                                </div>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="pay_on_delivery"
                                    checked={
                                        paymentMethod === "pay_on_delivery"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    id="pay_on_delivery"
                                />
                            </div>
                        </div>

                        {errors.paymentMethod && (
                            <div className="error">{errors.paymentMethod}</div>
                        )}
                    </div>

                    {paymentMethod === "pay_now" && exchangeRate ? (
                        <PayPalScriptProvider
                            options={{
                                "client-id":
                                    "AQ3bqTNDvGCH1U7nLErMFenDYICktL7jHF72IvwaJe6j3ANRZ-c1ZCFpM02CIYtr1UOMXn4g0h4a3mkx",
                            }}
                        >
                            <PayPalButtons
                                fundingSource={FUNDING.CARD}
                                style={{
                                    layout: "vertical",
                                    height: 50,
                                }}
                                onClick={(data, actions) => {
                                    const isValid = validateFields();
                                    if (!isValid) {
                                        return actions.reject();
                                    }
                                    return actions.resolve();
                                }}
                                createOrder={(data, actions) => {
                                    if (
                                        exchangeRate === null ||
                                        isNaN(exchangeRate)
                                    ) {
                                        alert(
                                            "Курс валюти ще не завантажено. Спробуйте пізніше."
                                        );
                                        return actions.reject();
                                    }

                                    const amountUSD = (
                                        totalPrice / exchangeRate
                                    ).toFixed(2);
                                    if (isNaN(amountUSD) || amountUSD <= 0) {
                                        alert(
                                            "Некоректна сума для оплати. Перевірте кошик."
                                        );
                                        return actions.reject();
                                    }

                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    currency_code: "USD",
                                                    value: amountUSD,
                                                },
                                            },
                                        ],
                                        payer: {
                                            address: {
                                                country_code: "UA",
                                            },
                                        },
                                        application_context: {
                                            shipping_preference: "NO_SHIPPING",
                                            user_action: "PAY_NOW",
                                        },
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    try {
                                        const details =
                                            await actions.order.capture();
                                        console.log(
                                            "Оплата успішно завершена:",
                                            details
                                        );

                                        formValuesRef.current.paymentstatus = 1;

                                        await handleSubmit();
                                    } catch (error) {
                                        console.error(
                                            "Помилка при завершенні оплати:",
                                            error
                                        );
                                        alert(
                                            "Сталася помилка при завершенні оплати. Спробуйте ще раз."
                                        );
                                    }
                                }}
                                onError={(err) => {
                                    console.error("Помилка PayPal:", err);
                                    alert(
                                        "Сталася помилка з PayPal. Спробуйте ще раз."
                                    );
                                }}
                            />
                        </PayPalScriptProvider>
                    ) : paymentMethod === "pay_on_delivery" ? (
                        <Button
                            className="place-order-button"
                            onClick={handleFormSubmit}
                            style={{ width: "100%", marginTop: "2px" }}
                        >
                            Оформити замовлення
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
