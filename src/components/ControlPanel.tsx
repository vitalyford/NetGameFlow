import React, { useState } from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  onStartPacketSimulation: () => void;
  onStartMessageSimulation: () => void;
  onClearLog: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onStartMessageSimulation,
  onClearLog,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [autoMode, setAutoMode] = useState(true);  const handleStartDemo = () => {
    if (isRunning) {
      // Stop the demo
      setIsRunning(false);
      onClearLog();
    } else {
      // Start the demo
      setIsRunning(true);
      // This will trigger the complete demo flow:
      // 1. DNS Resolution
      // 2. Normal packet flow
      // 3. DDoS attack demonstration
      // 4. Show packet behavior during attack
      onStartMessageSimulation();
    }  };

  return (
    <div className="control-panel">
      {/* Header */}
      <div className="panel-header">
        <h2>Network Demo</h2>
        <p>Complete Internet Flow Demonstration</p>
      </div>      {/* Main Control */}
      <div className="main-control">
        <button 
          className={`start-btn ${isRunning ? 'running' : ''}`}
          onClick={handleStartDemo}
        >
          <i className={`fas ${isRunning ? 'fa-stop' : 'fa-play'}`}></i>
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>{/* Demo Flow Info */}
      <div className="demo-info">
        <h3>Complete Network Journey</h3>
        <ol>
          <li>DNS Resolution (Find website IP)</li>
          <li>Send HTTPS Request</li>
          <li>Receive Web Content</li>
          <li>Fetch Additional Resources</li>
          <li>DDoS Attack & Recovery</li>
        </ol>
      </div>      {/* Mode Toggle */}
      <div className="mode-control">
        <label className="mode-toggle">
          <input 
            type="checkbox" 
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
          />
          <span>Auto Mode</span>
          <small>Automatic progression through steps</small>
        </label>
      </div>
    </div>
  );
};
