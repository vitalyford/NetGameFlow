import React, { useState } from 'react';
import type { NetworkStats } from '../types';
import './ControlPanel.css';

interface ControlPanelProps {
  stats: NetworkStats;
  onStartPacketSimulation: () => void;
  onStartMessageSimulation: () => void;
  onClearLog: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  stats,
  onStartMessageSimulation,
  onClearLog,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  const handleStartDemo = () => {
    setIsRunning(true);
    // This will trigger the complete demo flow:
    // 1. DNS Resolution
    // 2. Normal packet flow
    // 3. DDoS attack demonstration
    // 4. Show packet behavior during attack
    onStartMessageSimulation();
  };

  const handleStop = () => {
    setIsRunning(false);
    onClearLog();
  };

  const successRate = stats.sent > 0 ? Math.round((stats.received / stats.sent) * 100) : 100;
  return (
    <div className="control-panel">
      {/* Header */}
      <div className="panel-header">
        <h2>Network Demo</h2>
        <p>Complete Internet Flow Demonstration</p>
      </div>

      {/* Main Control */}
      <div className="main-control">
        <button 
          className={`start-btn ${isRunning ? 'running' : ''}`}
          onClick={handleStartDemo}
          disabled={isRunning}        >
          <i className={`fas ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
          {isRunning ? 'Running...' : 'Start'}        </button>
        
        {isRunning && (
          <button className="stop-btn" onClick={handleStop}>
            <i className="fas fa-stop"></i>
            Stop
          </button>
        )}
      </div>      {/* Demo Flow Info */}
      <div className="demo-info">
        <h3>Complete Network Journey</h3>
        <ol>
          <li>DNS Resolution (Find website IP)</li>
          <li>Send HTTPS Request</li>
          <li>Receive Web Content</li>
          <li>Fetch Additional Resources</li>
          <li>DDoS Attack & Recovery</li>
        </ol>
      </div>

      {/* Mode Toggle */}
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

      {/* Stats */}
      <div className="stats-panel">
        <h3>Network Stats</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="value">{stats.sent}</span>
            <span className="label">Packets Sent</span>
          </div>
          <div className="stat">
            <span className="value">{stats.received}</span>
            <span className="label">Received</span>
          </div>
          <div className="stat">
            <span className="value">{successRate}%</span>            <span className="label">Success Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
