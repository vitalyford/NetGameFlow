import React, { useState, useRef, useCallback } from 'react';
import type { StepControllerProps, StepData } from '@/types';
import { TechTerm } from '@/components/ui/TechTerm/TechTerm';
import styles from './StepController.module.css';

export const StepController = React.forwardRef<HTMLDivElement, StepControllerProps>(({
  isStepMode,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onAutoPlay,
  onPause,
  onReset,
  stepData,
}, ref) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ width: 450, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  const resizeData = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0,
    direction: ''
  });

  // Combined ref callback to handle both external ref and internal dragRef
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    dragRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  // Reset auto-play state when reaching the end or when manually navigating
  React.useEffect(() => {
    if (currentStep === totalSteps - 1) {
      setIsAutoPlaying(false);
    }
  }, [currentStep, totalSteps]);
  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Always stop propagation to prevent canvas dragging
    e.stopPropagation();

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
      startPosX: position.x,
      startPosY: position.y,
      direction
    };
  }, [size, position]); const handleMouseMove = useCallback((e: MouseEvent) => {
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
      let newX = resizeData.current.startPosX;
      let newY = resizeData.current.startPosY;

      // Handle different resize directions
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(350, Math.min(900, resizeData.current.startWidth + deltaX));
      }
      if (resizeDirection.includes('w')) {
        const potentialWidth = Math.max(350, Math.min(900, resizeData.current.startWidth - deltaX));
        newWidth = potentialWidth;
        newX = resizeData.current.startPosX + (resizeData.current.startWidth - potentialWidth);
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(450, Math.min(900, resizeData.current.startHeight + deltaY));
      }
      if (resizeDirection.includes('n')) {
        const potentialHeight = Math.max(450, Math.min(900, resizeData.current.startHeight - deltaY));
        newHeight = potentialHeight;
        newY = resizeData.current.startPosY + (resizeData.current.startHeight - potentialHeight);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, isResizing, resizeDirection]);
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

  // Memoize the style object for better performance (needs to be before early return)
  const tooltipStyle = React.useMemo(() => ({
    transform: `translate(${position.x}px, ${position.y}px)`,
    width: `${size.width}px`,
    height: isMinimized ? 'auto' : `${size.height}px`,
    cursor: isDragging ? 'grabbing' : 'grab'
  }), [position.x, position.y, size.width, size.height, isMinimized, isDragging]);

  if (!isStepMode || !stepData) return null;

  const handleAutoPlay = () => {
    setIsAutoPlaying(true);
    onAutoPlay();
  };

  const handlePause = () => {
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
  }; const getSimpleExplanation = (step: StepData) => {
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
  };

  return (<div
    ref={setRefs}
    className={`${styles.stepTooltip} ${isMinimized ? styles.minimized : ''} ${isDragging ? styles.dragging : ''} ${isResizing ? styles.resizing : ''}`}
    style={tooltipStyle}
    onMouseDown={handleMouseDown}
    onClick={(e) => e.stopPropagation()}
  >
    <div className={styles.tooltipHeader}>
      <div className={styles.dragHandle}>
        <i className="fas fa-grip-dots"></i>
      </div>
      <div className={styles.stepTitleSection}>
        <h4>{getStepTitle(stepData)}</h4>
        <p className={styles.simpleExplanation}>{stepData.description || getSimpleExplanation(stepData)}</p>
      </div>
      <div className={styles.headerControls}>
        <span className={styles.stepCounter}>{currentStep + 1} / {totalSteps}</span>
        <button
          className={styles.minimizeBtn}
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
          title={isMinimized ? "Expand details" : "Minimize"}
        >
          <i className={`fas fa-chevron-${isMinimized ? 'up' : 'down'}`}></i>
        </button>
      </div>
    </div>
    {!isMinimized && (
      <div className={styles.tooltipContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.currentAction}>
          <strong>What's happening:</strong> {stepData.action}
        </div>

        <div className={styles.toggleDetails}>
          <button
            className={styles.detailsToggle}
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailed(!isDetailed);
            }}
          >
            {isDetailed ? 'Hide' : 'Show'} Technical Details
          </button>
        </div>
        {isDetailed && (
          <>
            {/* Packet Journey Information */}
            <div className={styles.detailSection}>
              <h5>📦 Packet Journey</h5>
              <div className={styles.detailItem}>
                <span>From:</span>
                <span>{getDeviceName(stepData.fromDevice)} ({stepData.fromDevice})</span>
              </div>
              <div className={styles.detailItem}>
                <span>To:</span>
                <span>{getDeviceName(stepData.toDevice)} ({stepData.toDevice})</span>
              </div>
              {stepData.detailedExplanation && (
                <div className={styles.explanationText}>
                  {stepData.detailedExplanation.packetJourney}
                </div>
              )}
            </div>

            {/* Packet Information */}
            <div className={styles.detailSection}>
              <h5><TechTerm term="Packet">📨 Packet</TechTerm> Information</h5>
              <div className={styles.detailItem}>
                <span>Source:</span>
                <span>{stepData.packetInfo.source}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Destination:</span>
                <span>{stepData.packetInfo.destination}</span>
              </div>

              {/* NAT Information */}
              {stepData.packetInfo.natPerformed && (
                <div className={styles.natInfo}>
                  <h6><TechTerm term="NAT">🔄 NAT Translation</TechTerm></h6>
                  {stepData.packetInfo.originalSource && (
                    <div className={styles.detailItem}>
                      <span>Original Source:</span>
                      <span>{stepData.packetInfo.originalSource}</span>
                    </div>
                  )}
                  {stepData.packetInfo.translatedSource && (
                    <div className={styles.detailItem}>
                      <span>Translated To:</span>
                      <span>{stepData.packetInfo.translatedSource}</span>
                    </div>
                  )}
                  {stepData.packetInfo.originalDestination && (
                    <div className={styles.detailItem}>
                      <span>Original Dest:</span>
                      <span>{stepData.packetInfo.originalDestination}</span>
                    </div>
                  )}
                  {stepData.packetInfo.translatedDestination && (
                    <div className={styles.detailItem}>
                      <span>Translated To:</span>
                      <span>{stepData.packetInfo.translatedDestination}</span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.detailItem}>
                <span><TechTerm term="Protocol">Protocol</TechTerm>:</span>
                <span>{stepData.packetInfo.protocol}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Size:</span>
                <span>{stepData.packetInfo.size}</span>
              </div>
              {stepData.packetInfo.ttl && (
                <div className={styles.detailItem}>
                  <span><TechTerm term="TTL">TTL</TechTerm>:</span>
                  <span>{stepData.packetInfo.ttl}</span>
                </div>
              )}
              {stepData.packetInfo.request && (
                <div className={styles.detailItem}>
                  <span>Request:</span>
                  <span>{stepData.packetInfo.request}</span>
                </div>
              )}
              {stepData.packetInfo.query && (
                <div className={styles.detailItem}>
                  <span>Query:</span>
                  <span>{stepData.packetInfo.query}</span>
                </div>
              )}
            </div>

            {/* Routing Decision */}
            {stepData.packetInfo.routingDecision && (
              <div className={styles.detailSection}>
                <h5>🧭 Routing Decision</h5>
                <div className={styles.detailItem}>
                  <span>Decision:</span>
                  <span>{stepData.packetInfo.routingDecision}</span>
                </div>
                {stepData.packetInfo.nextHop && (
                  <div className={styles.detailItem}>
                    <span>Next Hop:</span>
                    <span>{stepData.packetInfo.nextHop}</span>
                  </div>
                )}
                {stepData.detailedExplanation && (
                  <div className={styles.explanationText}>
                    {stepData.detailedExplanation.routingLogic}
                  </div>
                )}
              </div>
            )}

            {/* Networking Concepts */}
            {stepData.detailedExplanation?.networkingConcepts && (
              <div className={styles.detailSection}>
                <h5>🎓 Networking Concepts</h5>
                <div className={styles.conceptsList}>
                  {stepData.detailedExplanation.networkingConcepts.map((concept, index) => (
                    <span key={index} className={styles.conceptTag}>
                      <TechTerm term={concept}>{concept}</TechTerm>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Routing Information */}
            {Object.keys(stepData.routingInfo).length > 0 && (
              <div className={styles.detailSection}>
                <h5><TechTerm term="Router">📋 Routing</TechTerm> Table</h5>
                <div className={styles.routingTable}>
                  {Object.entries(stepData.routingInfo).map(([dest, route]) => (
                    <div key={dest} className={styles.routeEntry}>
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
    )}
    {/* Step Controls - always visible */}
    <div className={styles.stepControls} onClick={(e) => e.stopPropagation()}>
      <button
        className={`${styles.stepBtn} ${styles.previous}`}
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        disabled={currentStep === 0}
        title="Previous Step"
        aria-label="Previous Step"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {!isAutoPlaying ? (
        <button
          className={`${styles.stepBtn} ${styles.autoPlay}`}
          onClick={(e) => {
            e.stopPropagation();
            handleAutoPlay();
          }}
          title="Auto Play All Steps"
          aria-label="Auto Play"
        >
          <i className="fas fa-play"></i>
        </button>
      ) : (
        <button
          className={`${styles.stepBtn} ${styles.pause}`}
          onClick={(e) => {
            e.stopPropagation();
            handlePause();
          }}
          title="Pause Auto Play"
          aria-label="Pause"
        >
          <i className="fas fa-pause"></i>
        </button>
      )}

      <button
        className={`${styles.stepBtn} ${styles.next}`}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={currentStep === totalSteps - 1}
        title="Next Step"
        aria-label="Next Step"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <button
        className={`${styles.stepBtn} ${styles.reset}`}
        onClick={(e) => {
          e.stopPropagation();
          onReset();
        }}
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
          className={`${styles.resizeHandle} ${styles.resizeNw}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
        />
        <div
          className={`${styles.resizeHandle} ${styles.resizeNe}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
        />
        <div
          className={`${styles.resizeHandle} ${styles.resizeSw}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
        />
        <div
          className={`${styles.resizeHandle} ${styles.resizeSe}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
        />

        {/* Edge handles */}
        <div
          className={`${styles.resizeHandle} ${styles.resizeN}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
        />
        <div
          className={`${styles.resizeHandle} ${styles.resizeS}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 's')}
        />
        <div
          className={`${styles.resizeHandle} ${styles.resizeW}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
        />
        <div
          className={`${styles.resizeHandle} ${styles.resizeE}`}
          onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
        />

        {/* Resize indicator */}
        <div className={styles.resizeIndicator}>
          <i className="fas fa-expand-arrows-alt"></i>
        </div>
      </>
    )}
  </div>
  );
});
