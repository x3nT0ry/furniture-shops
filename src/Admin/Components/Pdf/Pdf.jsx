import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../../Fonts/DejaVuSans-normal"; 

const Pdf = ({ order, className }) => {
  const generatePDF = () => {
    const doc = new jsPDF('landscape');

    doc.setFont("DejaVuSans", "normal");

    const getPaymentStatus = (status) => {
      if (status === 1) {
        return "Оплачено";
      } else if (status === 2) {
        return "Накладений платіж";
      } else {
        return "Невідомо";
      }
    };

    const paymentMethodText = getPaymentStatus(order.paymentstatus);

    doc.setFontSize(16);
    doc.text("Назва магазину: DriftWood", 13, 20);

    doc.setFontSize(12);
    doc.text(`Місто: ${order.city}`, 13, 30);

    const maxTextWidth = 260;
    const departmentText = `Поштове відділення: ${order.department}`;
    const splittedDepartmentText = doc.splitTextToSize(departmentText, maxTextWidth);
    doc.text(splittedDepartmentText, 13, 38);

    const departmentTextHeight = doc.getTextDimensions(splittedDepartmentText).h;
    const shippingMethodY = 38 + departmentTextHeight + 4; // 4 - відступ між рядками

    const shippingMethodText = `Спосіб доставки: ${order.shippingMethod}`;
    const splittedShippingText = doc.splitTextToSize(shippingMethodText, maxTextWidth);
    doc.text(splittedShippingText, 13, shippingMethodY);

    doc.setFontSize(18);
    const checkNumberY = shippingMethodY + doc.getTextDimensions(splittedShippingText).h + 10;
    doc.text(`Чек №${order.id}`, doc.internal.pageSize.getWidth() / 2, checkNumberY, {
      align: "center",
    });

    const tableColumn = ["Назва", "Кількість", "Ціна/од", "Сума"];
    const tableRows = [];

    order.items.forEach((item) => {
      const itemData = [
        item.name,
        item.quantity,
        `${item.price.toLocaleString("uk-UA")} грн`,
        `${(item.price * item.quantity).toLocaleString("uk-UA")} грн`,
      ];
      tableRows.push(itemData);
    });

    const tableY = checkNumberY + 10;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: tableY,
      styles: {
        font: "DejaVuSans", 
        fillColor: false,    
        textColor: 0,        
        lineColor: [0, 0, 0], 
        lineWidth: 0.1,      
      },
      headStyles: {
        fillColor: false, 
        textColor: 0,     
      },
      alternateRowStyles: {
        fillColor: false, 
      },
    });

    const afterTableY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Статус оплати: ${paymentMethodText}`, 13, afterTableY);

    doc.setFontSize(14);
    doc.text(
      `Загальна сума замовлення: ${order.total.toLocaleString("uk-UA")} грн`,
      13,
      afterTableY + 10
    );

    doc.save(`Замовлення_${order.id}.pdf`);
  };

  return (
    <button className={className} onClick={generatePDF}>
      Завантажити чек у PDF
    </button>
  );
};

export default Pdf;