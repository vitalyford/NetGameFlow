import React from 'react';
import type { EducationalPopup as EducationalPopupType } from '../types';
import './EducationalPopup.css';

interface EducationalPopupProps {
  popup: EducationalPopupType | null;
  onClose: () => void;
}

export const EducationalPopup: React.FC<EducationalPopupProps> = ({ popup, onClose }) => {
  if (!popup) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="educational-popup-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      tabIndex={-1}
    >
      <div className="educational-popup">
        <div className="educational-popup-header">
          <h2 id="popup-title" className="educational-popup-title">
            {popup.title}
          </h2>
          <button
            className="educational-popup-close"
            onClick={onClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>
        
        <div className="educational-popup-content">
          <div 
            className="educational-popup-description"
            dangerouslySetInnerHTML={{ __html: popup.content }}
          />
          
          {popup.imageUrl && (
            <div className="educational-popup-image">
              <img 
                src={popup.imageUrl} 
                alt={popup.imageAlt || popup.title}
                loading="lazy"
              />
            </div>
          )}
          
          {popup.additionalInfo && (
            <div className="educational-popup-additional">
              <h3>Additional Information</h3>
              <p>{popup.additionalInfo}</p>
            </div>
          )}
        </div>
        
        <div className="educational-popup-footer">
          <button
            className="educational-popup-button"
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationalPopup;
