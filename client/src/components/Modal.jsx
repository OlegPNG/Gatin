// src/components/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onCancel}>×</button>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-button confirm">
            Play Again
          </button>
          <button onClick={onCancel} className="modal-button cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
