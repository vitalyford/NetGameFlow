import React, { useRef, useState, useCallback } from 'react';
import type { EducationalPopup as EducationalPopupType } from '../../../../types';
import styles from './EducationalPopup.module.css';

interface EducationalPopupProps {
  popup: EducationalPopupType | null;
  onClose: () => void;
}

export const EducationalPopup: React.FC<EducationalPopupProps> = ({ popup, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 650, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const justFinishedResizing = useRef(false);
  const resizeData = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0
  });

  // Resize functionality
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsResizing(true);
    resizeData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
  }, [size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeData.current.startX;
    const deltaY = e.clientY - resizeData.current.startY;

    const newWidth = Math.max(400, Math.min(1200, resizeData.current.startWidth + deltaX));
    const newHeight = Math.max(300, Math.min(800, resizeData.current.startHeight + deltaY));

    setSize({ width: newWidth, height: newHeight });
  }, [isResizing]);
  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      justFinishedResizing.current = true;
      // Clear the flag after a short delay to allow for any pending click events
      setTimeout(() => {
        justFinishedResizing.current = false;
      }, 100);
    }
    setIsResizing(false);
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!popup) return null;
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Don't close if we just finished resizing
    if (justFinishedResizing.current) {
      return;
    }

    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      tabIndex={-1}
    >
      <div
        className={`${styles.popup} ${isResizing ? styles.resizing : ''}`}
        style={{ width: size.width, height: size.height }}
        onClick={(e) => {
          // Prevent backdrop click during or just after resizing
          if (isResizing || justFinishedResizing.current) {
            e.stopPropagation();
          }
        }}
      >
        <div className={styles.header}>
          <h2 id="popup-title" className={styles.title}>
            {popup.title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close popup"
            title="Close (ESC)"
          >
            ✕
          </button>
        </div>
        <div
          className={styles.content}
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
            minHeight: 0
          }}
        >
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: popup.content }}
          />

          {popup.imageUrl && (
            <div className={styles.image}>
              <img
                src={popup.imageUrl}
                alt={popup.imageAlt || popup.title}
                loading="lazy"
              />
            </div>
          )}
          {popup.additionalInfo && (
            <div className={styles.additional}>
              <h3>Additional Information</h3>
              <p>{popup.additionalInfo}</p>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <button
            className={styles.button}
            onClick={onClose}
          >
            OK
          </button>
          <div
            className={styles.resizeHandle}
            title="Drag to resize window"
            onMouseDown={handleResizeMouseDown}
          />
        </div>
      </div>
    </div>
  );
};

export default EducationalPopup;
