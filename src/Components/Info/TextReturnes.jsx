import React from "react";
import "./Info.css";

export default function TextReturns() {
    return (
        <div className="pay-delivery-container">
            <div className="pay-delivery-container1">
                <section className="returns-section">
                    <div className="pay-delivery-title">Returns</div>
                    <p>
                        Повернення здійснюється протягом{" "}
                        <strong>14 днів</strong> з дня отримання замовлення.
                    </p>
                    <p>
                        Товар повинен бути в оригінальній упаковці, без слідів
                        використання або збирання. У разі порушення цих умов
                        товар не підлягає обміну чи поверненню.
                    </p>
                    <p>
                        Для повернення та обміну товару зв'яжіться з нами
                        зручним для вас способом. Потім, акуратно запакуйте
                        товар, з усіма комплектуючими і надішліть посилку на
                        адресу, яку надасть вам менеджер по роботі з клієнтами.
                    </p>
                </section>
            </div>
        </div>
    );
}
