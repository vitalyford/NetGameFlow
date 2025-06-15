import React from 'react';
import type { LogEntry } from '../types';
import './Logger.css';

interface LoggerProps {
  entries: LogEntry[];
  onClear: () => void;
}

export const Logger: React.FC<LoggerProps> = ({ entries, onClear }) => {
  return (
    <div className="log-container">
      <div className="log-header">
        <h3>
          <i className="fas fa-list"></i>
          Network Activity Log
        </h3>
        <button className="clear-log-btn" onClick={onClear} title="Clear Log">
          <i className="fas fa-trash"></i>
        </button>
      </div>
      
      <div className="log-content">
        {entries.map((entry, index) => (
          <div key={index} className={`log-entry ${entry.type}`}>
            <span className="timestamp">{entry.timestamp}</span>
            <span className="message">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
