import { useState } from 'react';
import { NetworkSimulator } from './components/NetworkSimulator';
import type { NetworkStats } from './types';
import './App.css';

function App() {
  const [stats, setStats] = useState<NetworkStats>({ sent: 0, received: 0, lost: 0 });

  const handleStatsChange = (newStats: NetworkStats) => {
    setStats(newStats);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>NetworkFlow</h1>
          <span className="header-subtitle">Interactive Network Learning</span>
        </div>
        
        <div className="header-stats">
          {stats.sent > 0 || stats.received > 0 || stats.lost > 0 ? (
            <>
              <div className="stat-compact">
                <span className="stat-icon">📤</span>
                <span className="stat-number">{stats.sent}</span>
              </div>
              <div className="stat-compact">
                <span className="stat-icon">📥</span>
                <span className="stat-number">{stats.received}</span>
              </div>
              {stats.lost > 0 && (
                <div className="stat-compact error">
                  <span className="stat-icon">❌</span>
                  <span className="stat-number">{stats.lost}</span>
                </div>
              )}
            </>
          ) : (
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Ready to simulate</span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <NetworkSimulator
          className="network-simulator-container"
          onStatsChange={handleStatsChange}
          initialScenario="basic"
          showControls={true}
          showLogger={true}
          autoStart={false}
        />
      </main>

      <footer className="app-footer">
        <p>
          Built with React, TypeScript, and Vite. 
          Use this as a standalone app or embed the NetworkSimulator component in your own projects.
        </p>
      </footer>
    </div>
  );
}

export default App;
