import { NetworkSimulator } from './components/NetworkSimulator';
import './App.css';

function App() {
  return (
    <div className="app">
      <main className="app-main">
        <NetworkSimulator
          className="network-simulator-container"
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
