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
  const [isRunning, setIsRunning] = useState(false);const handleStartDemo = () => {
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
        <h3>Complete Network Journey</h3>        <ol>
          <li>DNS Resolution (Find website IP)</li>
          <li>Send HTTPS Request</li>
          <li>Receive Web Content</li>
          <li>Fetch Additional Resources</li>
          <li>DDoS Attack & Recovery</li>
        </ol>
      </div>

      {/* Footer */}
      <div className="panel-footer">
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
