// NetworkGame Flow - Component Library Exports
// Use these exports when importing this project as a reusable component

// Main components
export { NetworkSimulator } from './components/NetworkSimulator';
export { Device } from './components/Device';
export { Connection } from './components/Connection';
export { ControlPanel } from './components/ControlPanel';
export { Logger } from './components/Logger';
export { StepController } from './components/StepController';
export { EducationalPopup } from './components/EducationalPopup';

// Custom hooks
export { useNetworkSimulator } from './hooks/useNetworkSimulator';
export { useEducational } from './hooks/useEducational';

// Context providers
export { EducationalProvider } from './contexts/EducationalContext';

// Types
export type {
  Position,
  DeviceData,
  DeviceType,
  Connection as ConnectionType,
  PacketInfo,
  StepData,
  WebComponent,
  ChaosSettings,
  NetworkStats,
  ScenarioType,
  LogType,
  LogEntry,
  EducationalPopup as EducationalPopupType,
  NetworkSimulatorProps,
  DeviceProps,
  ConnectionProps,
  StepControllerProps,
} from './types';

// Main App component (for standalone usage)
export { default as App } from './App';
