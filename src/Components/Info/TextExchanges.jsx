import React from "react";
import "./Info.css";

export default function TextExchanges() {
    return (
        <div className="pay-delivery-container">
            <div className="pay-delivery-container2">
                <section className="exchanges-section">
                    <div className="pay-delivery-title">Exchanges</div>
                    <p>
                        Як компенсацію, згідно із законом України, ми надаємо
                        Вам право обрати такий самий товар з іншої партії, або
                        вибрати інший товар на ту саму суму грошей. Якщо Ви
                        хочете обміняти заводський брак, доставку в обидві
                        сторони оплачуємо ми. Якщо ви змінюєте якісний товар, за
                        доставку платите Ви.
                    </p>
                </section>
                <section className="quality-returns-section">
                    <p>
                        <strong>Повернення якісного товару</strong>{" "}
                    </p>
                    <p>
                        Друга причина – товар якісний, але він Вам просто не
                        сподобався чи не підійшов за кольором, розміром тощо.
                        Протягом <strong>14-ти днів</strong> Ви маєте повне
                        право повернути товар, що вам не сподобався.
                    </p>
                    <p>
                        Для цього є кілька умов, які мають бути дотримані з
                        Вашого боку:
                    </p>
                    <ul>
                        <li>збереження повної комплектації товару;</li>
                        <li>
                            збереження цілісного заводського пакування, пломби,
                            печаток;
                        </li>
                        <li>
                            товар збережений у тому вигляді, що було куплено;
                        </li>
                        <li>товар не використовувався.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}