import React from 'react';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onStartPacketSimulation: () => void;
  onStartMessageSimulation: () => void;
  onStopSimulation: () => void;
  isStepMode?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onStartMessageSimulation,
  onStopSimulation,
  isStepMode = false,
  currentStep = 0,
  totalSteps = 0,
}) => {
  // Use isStepMode to determine if simulation is running
  const isRunning = isStepMode;

  const handleStartDemo = () => {
    if (isRunning) {
      // Stop the demo completely and reset to initial state
      onStopSimulation();
    } else {
      // Start the demo
      // This will trigger the complete demo flow:
      // 1. DNS Resolution
      // 2. Normal packet flow
      // 3. DDoS attack demonstration
      // 4. Show packet behavior during attack
      onStartMessageSimulation();
    }
  }; return (
    <div className={styles.controlPanel}>
      {/* Header */}      <div className={styles.panelHeader}>
        <p>Complete Internet Flow Demonstration</p>
      </div>
      {/* Main Control */}
      <div className={styles.mainControl}>
        <button
          className={`${styles.startBtn} ${isRunning ? styles.running : ''}`}
          onClick={handleStartDemo}
        >
          <i className={`fas ${isRunning ? 'fa-stop' : 'fa-play'}`}></i>
          {isRunning ? 'Stop' : 'Start'}
        </button>      </div>
      {/* Demo Flow Info */}
      <div className={styles.demoInfo}>
        <h3>🌐 Complete Network Journey</h3>
        <ol>
          <li>🔍 DNS Resolution (Find website IP)</li>
          <li>📡 Send HTTPS Request</li>
          <li>📄 Receive Web Content</li>
          <li>🎯 Fetch CDN Resources</li>
          <li>⚡ DDoS Attack & Protection</li>
        </ol>
        <div className={styles.journeyNote}>
          <small>Watch 35+ detailed steps in action!</small>
        </div>
        {/* Simple Progress Bar - moved here to reduce DOM movement */}
        {isStepMode && totalSteps > 0 && (
          <div className={styles.stepProgress}>
            <div className={styles.progressInfo}>
              <span>Step {currentStep + 1} of {totalSteps}</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.panelFooter}>
        <p>
          <i className="fas fa-code"></i>
          Contact{' '}
          <a
            href="https://github.com/vitalyford/netgameflow"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit GitHub repository"
          >
            Vitaly Ford - NetGameFlow Repo
          </a>
          {' '}for improvements & Q/A
        </p>
      </div>
    </div>
  );
};
