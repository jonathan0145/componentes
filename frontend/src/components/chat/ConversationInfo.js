import React from 'react';

const ConversationInfo = ({ conversation, onClose }) => {
  return (
    <div className="h-100 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Información</h6>
        <button onClick={onClose} className="btn btn-sm btn-outline-secondary">
          ×
        </button>
      </div>
      <p>Panel de información en desarrollo...</p>
    </div>
  );
};

export default ConversationInfo;