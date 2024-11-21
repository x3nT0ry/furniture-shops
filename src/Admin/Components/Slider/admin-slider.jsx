import React, { useState, useEffect } from "react";
import "./AdminSlider.css";
import AddSlider from "./addSlider";
import DeleteSlider from "./deleteSlider";
import EditSlider from "./editSlider";

export default function AdminSlider() {
    const [slides, setSlides] = useState([]);
    const [selectedSlides, setSelectedSlides] = useState(new Set());
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/sliders");
            const data = await response.json();
            setSlides(data);
        } catch (error) {
            console.error("Error loading slides:", error);
        }
    };

    const handleSelectSlide = (id) => {
        const newSelectedSlides = new Set(selectedSlides);
        if (newSelectedSlides.has(id)) {
            newSelectedSlides.delete(id);
        } else {
            newSelectedSlides.add(id);
        }
        setSelectedSlides(newSelectedSlides);
    };

    const openAddModal = () => setShowAddModal(true);
    const closeAddModal = () => setShowAddModal(false);
    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const closeEditModal = () => setShowEditModal(false);

    const handleAddSlide = (newSlide) => {
        setSlides((prevSlides) => [...prevSlides, newSlide]);
        closeAddModal();
    };

    const handleEditSlide = (updatedSlide) => {
        setSlides((prevSlides) =>
            prevSlides.map((slide) => (slide.id_slider === updatedSlide.id_slider ? updatedSlide : slide))
        );
        closeEditModal();
    };

    const handleDeleteSlides = (ids) => {
        setSlides((prevSlides) => prevSlides.filter((slide) => !ids.includes(slide.id_slider)));
        setSelectedSlides(new Set());
        closeDeleteModal();
    };

    const handleEditButtonClick = (slide) => {
        setEditingSlide(slide);
        setShowEditModal(true);
    };

    const moveSlideUp = (index) => {
        if (index === 0) return;
        const newSlides = [...slides];
        [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
        setSlides(newSlides);
        updateSlideOrder(newSlides);
    };

    const moveSlideDown = (index) => {
        if (index === slides.length - 1) return;
        const newSlides = [...slides];
        [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
        setSlides(newSlides);
        updateSlideOrder(newSlides);
    };

    const updateSlideOrder = async (orderedSlides) => {
        try {
            await fetch("http://localhost:3001/api/sliders/order", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderedSlides: orderedSlides.map(slide => slide.id_slider) }),
            });
        } catch (error) {
            console.error("Error updating slide order:", error);
        }
    };

    return (
        <div className="admin-slider">
            <div className="button-group">
                <button onClick={openAddModal}>Додати</button>
                {selectedSlides.size > 0 && (
                    <button onClick={openDeleteModal}>Видалити</button>
                )}
            </div>

            {showAddModal && <AddSlider closeModal={closeAddModal} onAdd={handleAddSlide} />}
            {showDeleteModal && <DeleteSlider closeModal={closeDeleteModal} selectedSlides={Array.from(selectedSlides)} onDelete={handleDeleteSlides} />}
            {showEditModal && <EditSlider closeModal={closeEditModal} slide={editingSlide} onEdit={handleEditSlide} />}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Обрати</th>
                            <th>Зміна порядку</th>
                            <th>Зображення</th>
                            <th>Заголовок</th>
                            <th>Опис</th>
                            <th>Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slides.map((slide, index) => (
                            <tr key={slide.id_slider} style={{ cursor: 'pointer' }} onClick={() => handleSelectSlide(slide.id_slider)}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedSlides.has(slide.id_slider)}
                                        onChange={() => handleSelectSlide(slide.id_slider)}
                                    />
                                </td>
                                <td>
                                    {index > 0 && (
                                        <button 
                                            className="move-button" 
                                            onClick={(e) => { e.stopPropagation(); moveSlideUp(index); }}
                                        >
                                            ↑
                                        </button>
                                    )}
                                    {index < slides.length - 1 && (
                                        <button 
                                            className="move-button" 
                                            onClick={(e) => { e.stopPropagation(); moveSlideDown(index); }}
                                        >
                                            ↓
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <img src={`http://localhost:3001/images/slider/${slide.image}`} alt="Slide" width="100" />
                                </td>
                                <td>{slide.title}</td>
                                <td>{slide.description}</td>
                                <td>
                                    <button className="details-button" onClick={() => handleEditButtonClick(slide)}>Змінити</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
