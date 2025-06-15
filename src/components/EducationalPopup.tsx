import React, { useRef, useEffect, useState } from 'react';
import type { EducationalPopup as EducationalPopupType } from '../types';
import './EducationalPopup.css';

interface EducationalPopupProps {
  popup: EducationalPopupType | null;
  onClose: () => void;
}

export const EducationalPopup: React.FC<EducationalPopupProps> = ({ popup, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const overflow = contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setHasOverflow(overflow);
        if (overflow) {
          contentRef.current.classList.add('has-overflow');
        } else {
          contentRef.current.classList.remove('has-overflow');
        }
      }
    };

    if (popup) {
      // Check overflow after content loads
      setTimeout(checkOverflow, 100);
      
      // Check on window resize
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, [popup]);

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
      <div className="educational-popup">        <div className="educational-popup-header">
          <h2 id="popup-title" className="educational-popup-title">
            {popup.title}
          </h2>          <button
            className="educational-popup-close"
            onClick={onClose}
            aria-label="Close popup"
            title="Close (ESC)"
          >
            ✕
          </button>
        </div>        <div 
          className="educational-popup-content" 
          ref={contentRef}
          style={{
            maxHeight: '280px',
            height: '280px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            padding: '24px'
          }}
        >
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
          
          {hasOverflow && (
            <div className="educational-popup-scroll-hint">
              ⬇️ Scroll down for more content ⬇️
            </div>
          )}
        </div><div className="educational-popup-footer">
          <span className="educational-popup-hint" title="You can resize this window by dragging the bottom-right corner">
            💡 Click on any device to learn more • This window is resizable
          </span>
          <button
            className="educational-popup-button"
            onClick={onClose}
          >
            Got it! ✓
          </button>
          <div className="educational-popup-resize-handle" title="Drag to resize" />
        </div>
      </div>
    </div>
  );
};

export default EducationalPopup;
