import { useState } from 'react';
import { NetworkSimulator } from './components/NetworkSimulator';
import type { NetworkStats, ScenarioType } from './types';
import './App.css';

function App() {
  const [stats, setStats] = useState<NetworkStats>({ sent: 0, received: 0, lost: 0 });
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('basic');

  const handleStatsChange = (newStats: NetworkStats) => {
    setStats(newStats);
  };

  const handleScenarioChange = (scenario: ScenarioType) => {
    setCurrentScenario(scenario);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>NetworkGame Flow</h1>
        <p className="app-description">
          Interactive Network Simulation - Learn how data travels across the internet
        </p>
        <div className="app-stats">
          <div className="stat-item">
            <span className="stat-label">Packets Sent:</span>
            <span className="stat-value">{stats.sent}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Packets Received:</span>
            <span className="stat-value">{stats.received}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Packets Lost:</span>
            <span className="stat-value">{stats.lost}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Scenario:</span>
            <span className="stat-value">{currentScenario}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <NetworkSimulator
          className="network-simulator-container"
          onStatsChange={handleStatsChange}
          onScenarioChange={handleScenarioChange}
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
