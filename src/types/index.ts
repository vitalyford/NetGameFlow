// Core types for the Network Simulator
export interface Position {
  x: number;
  y: number;
}

export interface DeviceData {
  id: string;
  position: Position;
  active: boolean;
  isDragging: boolean;
  routingTable: RoutingTable;
  ip: string;
  type: DeviceType;
}

export interface RoutingTable {
  [destination: string]: string;
}

export type DeviceType = 
  | 'client' 
  | 'router1' 
  | 'ispRouter' 
  | 'internetRouter1' 
  | 'internetRouter2' 
  | 'internetRouter3' 
  | 'dnsServer' 
  | 'webServer' 
  | 'cdnServer';

export interface Connection {
  from: string;
  to: string;
}

export interface PacketInfo {
  source: string;
  destination: string;
  protocol: string;
  size: string;
  request?: string;
  query?: string;
  originalSource?: string; // Before NAT
  originalDestination?: string; // Before NAT
  translatedSource?: string; // After NAT
  translatedDestination?: string; // After NAT
  natPerformed?: boolean;
  routingDecision?: string;
  nextHop?: string;
  ttl?: number;
}

export interface StepData {
  stepNumber: number;
  fromDevice: string;
  toDevice: string;
  packetInfo: PacketInfo;
  routingInfo: RoutingTable;
  action: string;
  component?: WebComponent;
  phase?: string;
  description?: string;
  detailedExplanation?: {
    packetJourney: string;
    routingLogic: string;
    networkingConcepts: string[];
  };
}

export interface WebComponent {
  name: string;
  source: string;
  type: 'html' | 'css' | 'js' | 'image';
  route: string[];
  size: string;
}

export interface ChaosSettings {
  packetLoss: boolean;
  lossRate: number;
  networkDelay: boolean;
  congestion: boolean;
}

export interface NetworkStats {
  sent: number;
  received: number;
  lost: number;
}

export type ScenarioType = 'basic' | 'dns' | 'tcp' | 'routing';

export type LogType = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: LogType;
}

export interface NetworkSimulatorProps {
  className?: string;
  onStatsChange?: (stats: NetworkStats) => void;
  onScenarioChange?: (scenario: ScenarioType) => void;
  initialScenario?: ScenarioType;
  showControls?: boolean;
  showLogger?: boolean;
  autoStart?: boolean;
}

export interface DeviceProps {
  device: DeviceData;
  onDeviceMove: (deviceId: string, position: Position) => void;
  onDeviceClick: (deviceId: string) => void;
  containerRect: DOMRect;
}

export interface ConnectionProps {
  connections: Connection[];
  devices: Record<string, DeviceData>;
  activeConnections: Set<string>;
  currentStepConnection?: string;
}

export interface StepControllerProps {
  isStepMode: boolean;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onAutoPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  stepData?: StepData;
}

export interface EducationalPopup {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  additionalInfo?: string;
}
