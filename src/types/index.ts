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
  attackState?: 'normal' | 'under-attack' | 'recovery' | 'protected';
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
  | 'cdnServer'
  | 'botnetCloud'
  | 'cloudflareEdge';

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
  // DDoS and attack-related properties
  attackVectors?: string[];
  maliciousIPs?: string[];
  errorDetails?: string;
  protectionFeatures?: string[];
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
export type LogCategory = 'packet' | 'routing' | 'system' | 'security';

export interface LogDetails {
  packetInfo?: {
    protocol: string;
    source: string;
    destination: string;
    size?: string;
    ttl?: number;
    query?: string;
    originalSource?: string;
    originalDestination?: string;
    translatedSource?: string;
    translatedDestination?: string;
    natPerformed?: boolean;
    routingDecision?: string;
    nextHop?: string;
  };
  routingInfo?: Record<string, string>;
  performanceMetrics?: {
    latency: number;
    throughput: string;
    packetLoss: number;
  };
  securityInfo?: {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    protectionStatus: 'active' | 'inactive' | 'degraded';
    blockReason?: string;
  };
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: LogType;
  category?: LogCategory;
  details?: LogDetails;
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
