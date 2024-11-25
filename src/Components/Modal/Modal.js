import React from "react";
import "./Modal.css"; // CSS file for styling

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate__animated animate__fadeIn">
            <div className="modal-container">
                {/* <button className="modal-close" onClick={onClose}>
                    &times;
                </button> */}
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
