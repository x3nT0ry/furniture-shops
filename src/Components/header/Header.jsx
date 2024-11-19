import React, { useContext, useState } from "react";
import "./Header.css";
import cart from "../../Images/cart.png";
import cartHover from "../../Images/cartHover.png";
import logo from "../../Images/logo.png";
import { Link } from "react-router-dom";
import { CartContext } from "../cart/CartContext";

export default function Header() {
    const { cartItems } = useContext(CartContext);
    const [isHovered, setIsHovered] = useState(false);

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const displayCount = totalItems > 9 ? "9+" : totalItems;

    return (
        <header className="header">
            <div className="wrapper">
                <Link className="logo" to="/">
                    <img src={logo} alt="Logo" />
                </Link>
                <nav className="navigations">
                    <ul>
                        <li>
                            <Link className="nav-link" to="/">
                                Головна
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/furniture">
                                Товари
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/contact">
                                Контакти
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/payment-delivery">
                                Оплата & Доставка
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="cart">
                    <Link to="/cart">
                        <img
                            src={isHovered ? cartHover : cart}
                            alt="Cart"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        />
                        {totalItems > 0 && (
                            <span className="cart-badge">{displayCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
