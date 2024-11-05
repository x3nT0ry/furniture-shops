import React from "react";
import "./Footer.css";
import img1 from "../../Images/telegram.png";
import img2 from "../../Images/instagram.png";
import img3 from "../../Images/email.png";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer" style={{ height: "205px" }}>
            <div className="wrapper1">
                <div className="contentF">
                    <div className="text-footer">driftwood furniture shop</div>
                    <nav className="nav">
                        <ul>
                            <li>
                                <Link className="nav-link" to="/">
                                    Головна
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/Returns">
                                    Повернення
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/Exchanges">
                                    Обмін
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="social-links">
                        <a
                            href="https://t.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={img1} alt="Telegram" />
                        </a>
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={img2} alt="Instagram" />
                        </a>
                        <a href="mailto:email@example.com">
                            <img src={img3} alt="Email" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

