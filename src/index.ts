// NetworkGame Flow - Component Library Exports
// Use these exports when importing this project as a reusable component

// Main components
export { NetworkSimulator } from '@/components/features/network/NetworkSimulator';
export { Device } from '@/components/features/network/Device';
export { Connection } from '@/components/features/network/Connection';
export { ControlPanel } from '@/components/features/controls/ControlPanel';
export { Logger } from '@/components/features/logging/Logger';
export { StepController } from '@/components/features/controls/StepController';
export { EducationalPopup } from '@/components/features/education/EducationalPopup';

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
