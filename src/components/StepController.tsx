import React, { useState, useRef, useCallback } from 'react';
import type { StepControllerProps, StepData } from '../types';
import { TechTerm } from './TechTerm';
import './TechTerm.css';
import './StepController.css';

export const StepController: React.FC<StepControllerProps> = ({
  isStepMode,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onAutoPlay,
  onPause,
  onReset,
  stepData,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);  const [isDetailed, setIsDetailed] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ width: 450, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);  const dragRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const resizeData = useRef({ 
    startX: 0, 
    startY: 0, 
    startWidth: 0, 
    startHeight: 0,
    direction: '' 
  });

  // Reset auto-play state when reaching the end or when manually navigating
  React.useEffect(() => {
    if (currentStep === totalSteps - 1) {
      setIsAutoPlaying(false);
    }
  }, [currentStep, totalSteps]);
  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) {
      return; // Don't drag when clicking buttons
    }
    
    // Don't drag if clicking on resize handles
    if (e.target instanceof HTMLElement && e.target.closest('.resize-handle')) {
      return;
    }
    
    setIsDragging(true);
    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
    e.preventDefault();
  }, [position]);

  // Resize functionality
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    setResizeDirection(direction);
    resizeData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      direction
    };
  }, [size]);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    if (isDragging) {
      const deltaX = e.clientX - dragData.current.startX;
      const deltaY = e.clientY - dragData.current.startY;
      
      setPosition({
        x: dragData.current.startPosX + deltaX,
        y: dragData.current.startPosY + deltaY,
      });
    } else if (isResizing && resizeDirection) {
      const deltaX = e.clientX - resizeData.current.startX;
      const deltaY = e.clientY - resizeData.current.startY;
      
      let newWidth = resizeData.current.startWidth;
      let newHeight = resizeData.current.startHeight;
        // Handle different resize directions
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(350, Math.min(900, resizeData.current.startWidth + deltaX));
      }
      if (resizeDirection.includes('w')) {
        const widthDelta = -deltaX;
        newWidth = Math.max(350, Math.min(900, resizeData.current.startWidth + widthDelta));
        if (newWidth !== size.width) {
          setPosition(prev => ({ ...prev, x: prev.x - widthDelta }));
        }
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(450, Math.min(900, resizeData.current.startHeight + deltaY));
      }
      if (resizeDirection.includes('n')) {
        const heightDelta = -deltaY;
        newHeight = Math.max(450, Math.min(900, resizeData.current.startHeight + heightDelta));
        if (newHeight !== size.height) {
          setPosition(prev => ({ ...prev, y: prev.y - heightDelta }));
        }
      }
      
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, resizeDirection, size.width, size.height]);
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  }, []);
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!isStepMode || !stepData) return null;

  const handleAutoPlay = () => {
    setIsAutoPlaying(true);
    onAutoPlay();
  };  const handlePause = () => {
    setIsAutoPlaying(false);
    onPause();
  };

  const getStepTitle = (step: StepData) => {
    if (step.fromDevice === 'client' && step.toDevice === 'dnsServer') {
      return 'Looking up website address';
    } else if (step.component) {
      return `Downloading ${step.component.name}`;
    } else {
      return `Sending data from ${getDeviceName(step.fromDevice)} to ${getDeviceName(step.toDevice)}`;
    }
  };

  const getDeviceName = (deviceId: string) => {
    const names: Record<string, string> = {
      client: 'Your Computer',
      router1: 'Home Router',
      ispRouter: 'ISP Router',
      internetRouter1: 'Internet Router',
      internetRouter2: 'Internet Router',
      internetRouter3: 'Internet Router',
      dnsServer: 'DNS Server',
      webServer: 'Web Server',
      cdnServer: 'CDN Server'
    };
    return names[deviceId] || deviceId;
  };

  const getSimpleExplanation = (step: StepData) => {
    if (step.fromDevice === 'client' && step.toDevice === 'dnsServer') {
      return "Your computer is asking: 'What's the address for this website?'";
    } else if (step.fromDevice === 'dnsServer' && step.toDevice === 'client') {
      return "The DNS server replies: 'Here's the website's address!'";
    } else if (step.component) {
      return `Getting the ${step.component.type} file needed to display the webpage`;
    } else if (step.fromDevice === 'client' && step.toDevice === 'webServer') {
      return "Your computer is asking the website: 'Can I have your webpage?'";
    } else if (step.fromDevice === 'webServer' && step.toDevice === 'client') {
      return "The website is sending back: 'Here's my webpage!'";
    } else {
      return "Data is being passed through the internet infrastructure";
    }
  };  return (
    <div 
      className={`step-tooltip ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      ref={dragRef}
    >
      <div className="tooltip-header">
        <div className="drag-handle">
          <i className="fas fa-grip-dots"></i>
        </div>
        <div className="step-title-section">
          <h4>{getStepTitle(stepData)}</h4>
          <p className="simple-explanation">{stepData.description || getSimpleExplanation(stepData)}</p>
        </div>
        <div className="header-controls">
          <span className="step-counter">{currentStep + 1} / {totalSteps}</span>
          <button 
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand details" : "Minimize"}
          >
            <i className={`fas fa-chevron-${isMinimized ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="tooltip-content">
          <div className="current-action">
            <strong>What's happening:</strong> {stepData.action}
          </div>
          
          <div className="toggle-details">
            <button 
              className="details-toggle"
              onClick={() => setIsDetailed(!isDetailed)}
            >
              {isDetailed ? 'Hide' : 'Show'} Technical Details
            </button>
          </div>          {isDetailed && (
            <>
              {/* Packet Journey Information */}
              <div className="detail-section">
                <h5>📦 Packet Journey</h5>
                <div className="detail-item">
                  <span>From:</span>
                  <span>{getDeviceName(stepData.fromDevice)} ({stepData.fromDevice})</span>
                </div>
                <div className="detail-item">
                  <span>To:</span>
                  <span>{getDeviceName(stepData.toDevice)} ({stepData.toDevice})</span>
                </div>
                {stepData.detailedExplanation && (
                  <div className="explanation-text">
                    {stepData.detailedExplanation.packetJourney}
                  </div>
                )}
              </div>

              {/* Packet Information */}
              <div className="detail-section">
                <h5><TechTerm term="Packet">📨 Packet</TechTerm> Information</h5>
                <div className="detail-item">
                  <span>Source:</span>
                  <span>{stepData.packetInfo.source}</span>
                </div>
                <div className="detail-item">
                  <span>Destination:</span>
                  <span>{stepData.packetInfo.destination}</span>
                </div>
                
                {/* NAT Information */}
                {stepData.packetInfo.natPerformed && (
                  <div className="nat-info">
                    <h6><TechTerm term="NAT">🔄 NAT Translation</TechTerm></h6>
                    {stepData.packetInfo.originalSource && (
                      <div className="detail-item">
                        <span>Original Source:</span>
                        <span>{stepData.packetInfo.originalSource}</span>
                      </div>
                    )}
                    {stepData.packetInfo.translatedSource && (
                      <div className="detail-item">
                        <span>Translated To:</span>
                        <span>{stepData.packetInfo.translatedSource}</span>
                      </div>
                    )}
                    {stepData.packetInfo.originalDestination && (
                      <div className="detail-item">
                        <span>Original Dest:</span>
                        <span>{stepData.packetInfo.originalDestination}</span>
                      </div>
                    )}
                    {stepData.packetInfo.translatedDestination && (
                      <div className="detail-item">
                        <span>Translated To:</span>
                        <span>{stepData.packetInfo.translatedDestination}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="detail-item">
                  <span><TechTerm term="Protocol">Protocol</TechTerm>:</span>
                  <span>{stepData.packetInfo.protocol}</span>
                </div>
                <div className="detail-item">
                  <span>Size:</span>
                  <span>{stepData.packetInfo.size}</span>
                </div>
                {stepData.packetInfo.ttl && (
                  <div className="detail-item">
                    <span><TechTerm term="TTL">TTL</TechTerm>:</span>
                    <span>{stepData.packetInfo.ttl}</span>
                  </div>
                )}
                {stepData.packetInfo.request && (
                  <div className="detail-item">
                    <span>Request:</span>
                    <span>{stepData.packetInfo.request}</span>
                  </div>
                )}
                {stepData.packetInfo.query && (
                  <div className="detail-item">
                    <span>Query:</span>
                    <span>{stepData.packetInfo.query}</span>
                  </div>
                )}
              </div>

              {/* Routing Decision */}
              {stepData.packetInfo.routingDecision && (
                <div className="detail-section">
                  <h5>🧭 Routing Decision</h5>
                  <div className="detail-item">
                    <span>Decision:</span>
                    <span>{stepData.packetInfo.routingDecision}</span>
                  </div>
                  {stepData.packetInfo.nextHop && (
                    <div className="detail-item">
                      <span>Next Hop:</span>
                      <span>{stepData.packetInfo.nextHop}</span>
                    </div>
                  )}
                  {stepData.detailedExplanation && (
                    <div className="explanation-text">
                      {stepData.detailedExplanation.routingLogic}
                    </div>
                  )}
                </div>
              )}

              {/* Networking Concepts */}
              {stepData.detailedExplanation?.networkingConcepts && (
                <div className="detail-section">
                  <h5>🎓 Networking Concepts</h5>
                  <div className="concepts-list">
                    {stepData.detailedExplanation.networkingConcepts.map((concept, index) => (
                      <span key={index} className="concept-tag">
                        <TechTerm term={concept}>{concept}</TechTerm>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Routing Information */}
              {Object.keys(stepData.routingInfo).length > 0 && (
                <div className="detail-section">
                  <h5><TechTerm term="Router">📋 Routing</TechTerm> Table</h5>
                  <div className="routing-table">
                    {Object.entries(stepData.routingInfo).map(([dest, route]) => (
                      <div key={dest} className="route-entry">
                        <span>{dest}:</span>
                        <span>{route}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}      {/* Step Controls - always visible */}
      <div className="step-controls">        <button
          className="step-btn previous"
          onClick={onPrevious}
          disabled={currentStep === 0}
          title="Previous Step"
          aria-label="Previous Step"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        {!isAutoPlaying ? (
          <button
            className="step-btn auto-play"
            onClick={handleAutoPlay}
            title="Auto Play All Steps"
            aria-label="Auto Play"
          >
            <i className="fas fa-play"></i>
          </button>
        ) : (
          <button
            className="step-btn pause"
            onClick={handlePause}
            title="Pause Auto Play"
            aria-label="Pause"
          >
            <i className="fas fa-pause"></i>
          </button>
        )}
        
        <button
          className="step-btn next"
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          title="Next Step"
          aria-label="Next Step"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        
        <button
          className="step-btn reset"
          onClick={onReset}
          title="Restart Demo from Beginning"
          aria-label="Restart Demo"
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>

      {/* Resize Handles */}
      {!isMinimized && (
        <>
          {/* Corner handles */}
          <div 
            className="resize-handle resize-nw" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div 
            className="resize-handle resize-ne" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div 
            className="resize-handle resize-sw" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div 
            className="resize-handle resize-se" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          
          {/* Edge handles */}
          <div 
            className="resize-handle resize-n" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div 
            className="resize-handle resize-s" 
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div 
            className="resize-handle resize-w" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />          <div 
            className="resize-handle resize-e" 
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          
          {/* Resize indicator */}
          <div className="resize-indicator">
            <i className="fas fa-expand-arrows-alt"></i>
          </div>
        </>
      )}
    </div>
  );
};
