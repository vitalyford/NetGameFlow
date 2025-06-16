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
    </div>
  );
}

export default App;
