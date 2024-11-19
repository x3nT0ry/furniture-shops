import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewCharacteristic.css';

export default function NewCharacteristic() {
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCharacteristic, setModalCharacteristic] = useState({
    id: null,
    title: '',
    options: [{ id: null, title: '' }] 
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchCharacteristics();
  }, []);

  const fetchCharacteristics = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/characteristics');
      setCharacteristics(response.data);
    } catch (error) {
      console.error('Помилка при отриманні характеристик:', error);
    }
  };

  const handleSelectChange = (e, id) => {
    const isChecked = e.target.checked;
    let updatedSelectedIds = [...selectedIds];

    if (isChecked) {
      updatedSelectedIds.push(id);
    } else {
      updatedSelectedIds = updatedSelectedIds.filter((selectedId) => selectedId !== id);
    }

    setSelectedIds(updatedSelectedIds);
    setShowDeleteButton(updatedSelectedIds.length > 0);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete('http://localhost:3001/api/characteristics', { data: { ids: selectedIds } });
      fetchCharacteristics();
      setSelectedIds([]);
      setShowDeleteButton(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Помилка при видаленні характеристик:', error);
    }
  };

  const handleAdd = () => {
    setModalCharacteristic({
      id: null,
      title: '',
      options: [{ id: null, title: '' }] 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (characteristic) => {
    setModalCharacteristic({
      id: characteristic.id,
      title: characteristic.title,
      options: characteristic.options 
    });
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalCharacteristic((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionsChange = (index, value) => {
    const updatedOptions = [...modalCharacteristic.options];
    updatedOptions[index] = { ...updatedOptions[index], title: value };
    setModalCharacteristic((prev) => ({
      ...prev,
      options: updatedOptions
    }));
  };

  const addOptionField = () => {
    setModalCharacteristic((prev) => ({
      ...prev,
      options: [...prev.options, { id: null, title: '' }]
    }));
  };

  const removeOptionField = (index) => {
    const updatedOptions = [...modalCharacteristic.options];
    updatedOptions.splice(index, 1);
    setModalCharacteristic((prev) => ({
      ...prev,
      options: updatedOptions
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const { id, title, options } = modalCharacteristic;

    if (!title.trim()) {
      alert('Назва характеристики не може бути пустою');
      return;
    }

    if (options.some((option) => !option.title.trim())) {
      alert('Опції не можуть бути пустими');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/characteristics/${id}`, { title, options });
      } else {
        await axios.post('http://localhost:3001/api/characteristics', { title, options });
      }
      fetchCharacteristics();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Помилка при збереженні характеристики:', error);
    }
  };

  const handleRowClick = (id) => {
    const isSelected = selectedIds.includes(id);
    const updatedSelectedIds = isSelected
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(updatedSelectedIds);
    setShowDeleteButton(updatedSelectedIds.length > 0);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="new-characteristic-container">
      <div className="buttons-container">
        <button className="add-button" onClick={handleAdd}>
          Додати
        </button>
        {showDeleteButton && (
          <button className="delete-button" onClick={handleDelete}>
            Видалити
          </button>
        )}
      </div>
      <div className="table-container">
        <table className="characteristics-table">
          <thead>
            <tr>
              <th>Обрати</th>
              <th>Властивості</th>
              <th>Опції</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {characteristics.map((characteristic) => (
              <tr
                key={characteristic.id}
                onClick={() => handleRowClick(characteristic.id)}
                className={selectedIds.includes(characteristic.id) ? 'selected-row' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(characteristic.id)}
                    onChange={(e) => handleSelectChange(e, characteristic.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>{characteristic.title}</td>
                <td>{characteristic.options.map((option) => option.title).join(', ')}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(characteristic);
                    }}
                  >
                    Змінити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay2">
          <div className="modal2">
            <h3>{modalCharacteristic.id ? 'Редагувати характеристику' : 'Додати характеристику'}</h3>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group2">
                <label htmlFor="title">Назва характеристики:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={modalCharacteristic.title}
                  onChange={handleModalChange}
                />
              </div>
              <div className="form-group2">
                <label>Опції:</label>
                {modalCharacteristic.options.map((option, index) => (
                  <div key={index} className="option-field2">
                    <input
                      type="text"
                      value={option.title}
                      onChange={(e) => handleOptionsChange(index, e.target.value)}
                    />
                    <button type="button" className="remove-option-button2" onClick={() => removeOptionField(index)}>
                      &times;
                    </button>
                  </div>
                ))}
                <button type="button" className="add-option-button2" onClick={addOptionField}>
                  Додати опцію
                </button>
              </div>
              <div className="modal-buttons2">
                <button type="submit" className="save-button2">
                  Зберегти
                </button>
                <button type="button" className="cancel-button2" onClick={handleModalClose}>
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Ви впевнені, що хочете видалити вибрані властивості?</p>
            <div className="modal-buttons2">
              <button className="confirm-delete-button2" onClick={confirmDelete}>
                Так, видалити
              </button>
              <button className="cancel-button2" onClick={() => setIsDeleteModalOpen(false)}>
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}