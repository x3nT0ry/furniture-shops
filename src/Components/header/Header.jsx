import React from "react";
import "./Header.css";
import cart from "../../Images/cart.png";
import logo from "../../Images/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="wrapper">
                <Link className="logo" to="/">
                    <img src={logo} alt="" />
                </Link>
                <nav className="navigation">
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
                    <img src={cart} alt="" />
                </div>
            </div>
        </header>
    );
}
