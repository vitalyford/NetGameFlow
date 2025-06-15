import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  DeviceData, 
  Position, 
  ScenarioType, 
  NetworkStats, 
  ChaosSettings,
  LogEntry,
  StepData,
  DeviceType
} from '../types';
import { 
  DEVICE_IPS, 
  ROUTING_TABLES, 
  NETWORK_CONNECTIONS,
  SCENARIO_NAMES 
} from '../utils/constants';
import { Helpers } from '../utils/helpers';

export const useNetworkSimulator = (initialScenario: ScenarioType = 'basic') => {
  // Core state
  const [devices, setDevices] = useState<Record<string, DeviceData>>({});
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>(initialScenario);
  const [stats, setStats] = useState<NetworkStats>({ sent: 0, received: 0, lost: 0 });
  const [chaosSettings, setChaosSettings] = useState<ChaosSettings>({
    packetLoss: false,
    lossRate: 5,
    networkDelay: false,
    congestion: false,
  });
  
  // Step-by-step simulation state
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<StepData[]>([]);
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());
  
  // Logger state
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    {
      timestamp: Helpers.formatTimestamp(),
      message: 'Network Simulator initialized. Ready to learn!',
      type: 'info',
    },
  ]);
  
  // Auto-play state
  const autoPlayInterval = useRef<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  // Initialize devices
  const initializeDevices = useCallback((containerRect: DOMRect) => {
    // Ensure minimum container size and add padding for device boundaries
    const minWidth = 800;
    const minHeight = 500;
    const width = Math.max(containerRect.width, minWidth);
    const height = Math.max(containerRect.height, minHeight);
    
    // Add padding to ensure devices don't get positioned at the very edge
    const padding = 80; // Enough for device size + some margin
    const usableWidth = width - (padding * 2);
    const usableHeight = height - (padding * 2);
    
    const devicePositions: Record<string, Position> = {
      client: { 
        x: padding + usableWidth * 0.08, 
        y: padding + usableHeight * 0.15 
      },
      router1: { 
        x: padding + usableWidth * 0.30, 
        y: padding + usableHeight * 0.15 
      },
      ispRouter: { 
        x: padding + usableWidth * 0.52, 
        y: padding + usableHeight * 0.15 
      },
      internetRouter1: { 
        x: padding + usableWidth * 0.74, 
        y: padding + usableHeight * 0.08 
      },
      internetRouter2: { 
        x: padding + usableWidth * 0.20, 
        y: padding + usableHeight * 0.35 
      },
      internetRouter3: { 
        x: padding + usableWidth * 0.74, 
        y: padding + usableHeight * 0.35 
      },
      dnsServer: { 
        x: padding + usableWidth * 0.08, 
        y: padding + usableHeight * 0.60 
      },
      webServer: { 
        x: padding + usableWidth * 0.52, 
        y: padding + usableHeight * 0.60 
      },
      cdnServer: { 
        x: padding + usableWidth * 0.74, 
        y: padding + usableHeight * 0.60 
      },
    };

    const newDevices: Record<string, DeviceData> = {};
    
    Object.entries(devicePositions).forEach(([id, position]) => {
      newDevices[id] = {
        id,
        position,
        active: false,
        isDragging: false,
        routingTable: ROUTING_TABLES[id as keyof typeof ROUTING_TABLES] || {},
        ip: DEVICE_IPS[id as keyof typeof DEVICE_IPS] || '127.0.0.1',
        type: id as DeviceType,
      };
    });

    setDevices(newDevices);
  }, []);

  // Device movement handler
  const handleDeviceMove = useCallback((deviceId: string, position: Position) => {
    setDevices(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        position,
      },
    }));
  }, []);

  // Device activation
  const activateDevice = useCallback((deviceId: string) => {
    setDevices(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        active: true,
      },
    }));
  }, []);

  const clearDeviceHighlights = useCallback(() => {
    setDevices(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        updated[id] = { ...updated[id], active: false };
      });
      return updated;
    });
  }, []);

  // Connection management
  const highlightConnection = useCallback((fromId: string, toId: string) => {
    setActiveConnections(prev => new Set([...prev, `${fromId}-${toId}`]));
  }, []);

  const clearConnectionHighlights = useCallback(() => {
    setActiveConnections(new Set());
  }, []);

  // Logging
  const addLogEntry = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      timestamp: Helpers.formatTimestamp(),
      message,
      type,
    };
    
    setLogEntries(prev => [...prev.slice(-49), entry]); // Keep last 50 entries
  }, []);

  const clearLog = useCallback(() => {
    setLogEntries([{
      timestamp: Helpers.formatTimestamp(),
      message: 'Log cleared. Network Simulator ready.',
      type: 'info',
    }]);
  }, []);

  // Scenario management
  const changeScenario = useCallback((scenario: ScenarioType) => {
    setCurrentScenario(scenario);
    addLogEntry(`Switched to scenario: ${SCENARIO_NAMES[scenario]}`);
    setIsStepMode(false);
    clearConnectionHighlights();
    clearDeviceHighlights();
  }, [addLogEntry, clearConnectionHighlights, clearDeviceHighlights]);
  // Step-by-step simulation
  const startStepMode = useCallback((type: 'packet' | 'message') => {
    const newStepData: StepData[] = [];
    
    // Comprehensive demo sequence: DNS resolution → Packet journey → Resource fetching → DDoS simulation
      // Phase 1: DNS Resolution with NAT (8 steps total)
    newStepData.push({
      stepNumber: 1,
      fromDevice: 'client',
      toDevice: 'router1',
      packetInfo: {
        source: '192.168.1.100:54321',
        destination: '8.8.8.8:53',
        protocol: 'DNS (UDP)',
        size: '64 bytes',
        query: 'www.example.com A?',
        ttl: 64,
        routingDecision: 'Default gateway lookup',
        nextHop: '192.168.1.1'
      },
      routingInfo: devices.client?.routingTable || {},
      action: 'Client initiates DNS lookup',
      phase: 'dns',
      description: 'Your computer starts DNS resolution for www.example.com',
      detailedExplanation: {
        packetJourney: 'Packet travels from client (192.168.1.100) to home router (192.168.1.1)',
        routingLogic: 'Client checks routing table: destination 8.8.8.8 is not in local subnet, so packet is sent to default gateway',
        networkingConcepts: ['Default Gateway', 'Subnet Mask', 'Local Routing Table']
      }
    });

    newStepData.push({
      stepNumber: 2,
      fromDevice: 'router1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '98.76.54.32:12345',
        destination: '8.8.8.8:53',
        protocol: 'DNS (UDP)',
        size: '64 bytes',
        query: 'www.example.com A?',
        originalSource: '192.168.1.100:54321',
        translatedSource: '98.76.54.32:12345',
        natPerformed: true,
        ttl: 63,
        routingDecision: 'NAT + ISP gateway',
        nextHop: '203.0.113.1'
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'Router performs NAT and forwards to ISP',
      phase: 'dns',
      description: 'Home router translates private IP to public IP and forwards to ISP',
      detailedExplanation: {
        packetJourney: 'Router receives packet from 192.168.1.100, performs NAT translation, sends as 98.76.54.32 to ISP',
        routingLogic: 'NAT table: 192.168.1.100:54321 → 98.76.54.32:12345. Route to 8.8.8.8 via ISP gateway 203.0.113.1',
        networkingConcepts: ['NAT (Network Address Translation)', 'Port Translation', 'Public vs Private IP', 'TTL Decrement']
      }
    });

    newStepData.push({
      stepNumber: 3,
      fromDevice: 'ispRouter',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '98.76.54.32:12345',
        destination: '8.8.8.8:53',
        protocol: 'DNS (UDP)',
        size: '64 bytes',
        query: 'www.example.com A?',
        ttl: 62,
        routingDecision: 'BGP routing to Google AS',
        nextHop: '172.16.0.1'
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP routes towards Google DNS',
      phase: 'dns',
      description: 'ISP router consults BGP table to route packet toward Google\'s network',
      detailedExplanation: {
        packetJourney: 'ISP router forwards packet from customer network toward Google\'s Autonomous System',
        routingLogic: 'BGP table lookup: 8.8.8.8/32 belongs to Google AS15169, best path via next-hop 172.16.0.1',
        networkingConcepts: ['BGP (Border Gateway Protocol)', 'Autonomous Systems', 'Internet Routing', 'Longest Prefix Match']
      }
    });    newStepData.push({
      stepNumber: 4,
      fromDevice: 'internetRouter1',
      toDevice: 'dnsServer',
      packetInfo: {
        source: '98.76.54.32:12345',
        destination: '8.8.8.8:53',
        protocol: 'DNS (UDP)',
        size: '64 bytes',
        query: 'www.example.com A?',
        ttl: 61,
        routingDecision: 'Direct delivery to Google DNS',
        nextHop: '8.8.8.8'
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Packet reaches Google DNS server',
      phase: 'dns',
      description: 'DNS query reaches Google\'s public DNS server',
      detailedExplanation: {
        packetJourney: 'Final hop delivers packet to Google DNS server at 8.8.8.8',
        routingLogic: 'Direct connected route: 8.8.8.8/32 is directly reachable via local interface',        networkingConcepts: ['DNS Resolution', 'Anycast Routing', 'Public DNS Servers']
      }
    });

    // DNS Response - Return journey (steps 5-8)
    newStepData.push({
      stepNumber: 5,
      fromDevice: 'dnsServer',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 64,
        routingDecision: 'Return to source via reverse path',
        nextHop: '172.16.0.1'
      },      routingInfo: devices.dnsServer?.routingTable || {},
      action: 'DNS server responds with IP address',
      phase: 'dns',
      description: 'DNS server resolves www.example.com to 93.184.216.34',
      detailedExplanation: {
        packetJourney: 'DNS server creates response packet with resolved IP address, destination set to original source',
        routingLogic: 'Response destination 98.76.54.32 is not local, route via default gateway back toward ISP',
        networkingConcepts: ['DNS Response', 'A Record Resolution', 'Reverse Path Routing']
      }
    });

    newStepData.push({
      stepNumber: 6,
      fromDevice: 'internetRouter1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 63,
        routingDecision: 'Route back to customer ISP',
        nextHop: '203.0.113.1'
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Routing DNS response back through internet',
      phase: 'dns',
      description: 'Internet backbone routes response back toward customer ISP',
      detailedExplanation: {
        packetJourney: 'Response packet travels back through internet infrastructure to customer ISP',
        routingLogic: '98.76.54.32/32 belongs to customer ISP block, route via learned BGP path',
        networkingConcepts: ['Internet Backbone', 'BGP Path Selection', 'Reverse Routing']
      }
    });

    newStepData.push({
      stepNumber: 7,
      fromDevice: 'ispRouter',
      toDevice: 'router1',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 62,
        routingDecision: 'Route to customer premises',
        nextHop: '98.76.54.32'
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP routes response to customer',
      phase: 'dns',
      description: 'ISP recognizes customer public IP and routes to customer router',
      detailedExplanation: {
        packetJourney: 'ISP router receives response and forwards to customer router based on IP assignment',
        routingLogic: '98.76.54.32 is assigned to this customer, forward via customer connection interface',
        networkingConcepts: ['ISP Routing', 'Customer IP Assignment', 'Last Mile Delivery']
      }
    });

    newStepData.push({
      stepNumber: 8,
      fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '192.168.1.100:54321',        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        originalDestination: '98.76.54.32:12345',
        translatedDestination: '192.168.1.100:54321',
        natPerformed: true,
        ttl: 61,
        routingDecision: 'NAT reverse translation',
        nextHop: '192.168.1.100'
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'Router performs reverse NAT to client',
      phase: 'dns',
      description: 'Home router translates public IP back to private IP and delivers to client',
      detailedExplanation: {
        packetJourney: 'Router performs reverse NAT: 98.76.54.32:12345 → 192.168.1.100:54321, delivers to client',
        routingLogic: 'NAT state table lookup: session 98.76.54.32:12345 maps back to 192.168.1.100:54321',
        networkingConcepts: ['Reverse NAT', 'Stateful NAT Table', 'Session Tracking', 'Local Delivery']
      }
    });

    newStepData.push({
      stepNumber: 7,
      fromDevice: 'ispRouter',
      toDevice: 'router1',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '192.168.1.100:54321',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP routes response to home network',
      phase: 'dns',
      description: 'ISP router forwards the DNS response to your home router'
    });

    newStepData.push({
      stepNumber: 8,
      fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '192.168.1.100:54321',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'DNS response reaches your computer',
      phase: 'dns',
      description: 'Your computer now knows the IP address: 93.184.216.34'
    });

    // Phase 2: Initial HTTP Request (6 steps)
    newStepData.push({
      stepNumber: 9,
      fromDevice: 'client',
      toDevice: 'router1',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
      },
      routingInfo: devices.client?.routingTable || {},
      action: 'Sending HTTPS request to website',
      phase: 'request',
      description: 'Now that we have the IP, request the website over secure HTTPS'
    });

    newStepData.push({
      stepNumber: 10,
      fromDevice: 'router1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'Router forwards HTTPS request',
      phase: 'request',
      description: 'Home router forwards your HTTPS request to the ISP'
    });    newStepData.push({
      stepNumber: 11,
      fromDevice: 'ispRouter',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP routes through internet',
      phase: 'request',
      description: 'ISP router determines the best path to the destination server'
    });    newStepData.push({
      stepNumber: 12,
      fromDevice: 'internetRouter1',
      toDevice: 'internetRouter3',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Routing through internet backbone',
      phase: 'request',
      description: 'Packet travels through multiple internet routers to reach destination'
    });    newStepData.push({
      stepNumber: 13,
      fromDevice: 'internetRouter3',
      toDevice: 'webServer',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
      },
      routingInfo: devices.internetRouter3?.routingTable || {},
      action: 'Request reaches web server',
      phase: 'request',
      description: 'Your HTTPS request finally reaches the destination web server'
    });    // Phase 3: Web Server Response (5 steps)
    newStepData.push({
      stepNumber: 14,
      fromDevice: 'webServer',
      toDevice: 'internetRouter3',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: 'HTTP/1.1 200 OK + HTML',
      },
      routingInfo: devices.webServer?.routingTable || {},
      action: 'Server sends HTML response',
      phase: 'response',
      description: 'Web server processes request and sends back HTML page content'
    });    newStepData.push({
      stepNumber: 15,
      fromDevice: 'internetRouter3',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: 'HTTP/1.1 200 OK + HTML',
      },
      routingInfo: devices.internetRouter3?.routingTable || {},
      action: 'Response travels back through internet',
      phase: 'response',
      description: 'HTML response travels back through internet infrastructure'
    });    newStepData.push({
      stepNumber: 16,
      fromDevice: 'internetRouter1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: 'HTTP/1.1 200 OK + HTML',
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Returning through ISP network',
      phase: 'response',
      description: 'Response packet returns through your ISP network'
    });    newStepData.push({
      stepNumber: 17,
      fromDevice: 'ispRouter',
      toDevice: 'router1',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: 'HTTP/1.1 200 OK + HTML',
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'Back to home network',
      phase: 'response',
      description: 'Response arrives back at your home router'
    });    newStepData.push({
      stepNumber: 18,
      fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: 'HTTP/1.1 200 OK + HTML',
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'HTML received by your computer',
      phase: 'response',
      description: 'Your computer receives the HTML and starts rendering the webpage'    });    // Phase 4: CDN Resource Fetching (6 steps - through proper internet routing)
    newStepData.push({
      stepNumber: 19,
      fromDevice: 'client',
      toDevice: 'router1',
      packetInfo: {
        source: '192.168.1.100:45679',
        destination: '151.101.1.140:443',
        protocol: 'HTTPS (TCP)',
        size: '512 bytes',
        query: 'GET /style.css',
      },
      routingInfo: devices.client?.routingTable || {},
      action: 'Requesting CSS from CDN',
      phase: 'resources',
      description: 'Browser needs CSS stylesheet and requests it from a Content Delivery Network'
    });

    newStepData.push({
      stepNumber: 20,
      fromDevice: 'router1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '192.168.1.100:45679',
        destination: '151.101.1.140:443',
        protocol: 'HTTPS (TCP)',
        size: '512 bytes',
        query: 'GET /style.css',
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'Router forwards CDN request to ISP',
      phase: 'resources',
      description: 'Home router routes request through ISP to reach CDN server'
    });

    newStepData.push({
      stepNumber: 21,
      fromDevice: 'ispRouter',
      toDevice: 'cdnServer',
      packetInfo: {
        source: '192.168.1.100:45679',
        destination: '151.101.1.140:443',
        protocol: 'HTTPS (TCP)',
        size: '512 bytes',
        query: 'GET /style.css',
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP routes to nearby CDN server',
      phase: 'resources',
      description: 'ISP finds the closest CDN server for faster content delivery'
    });

    newStepData.push({
      stepNumber: 22,
      fromDevice: 'cdnServer',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
      },
      routingInfo: devices.cdnServer?.routingTable || {},
      action: 'CDN responds with CSS file',
      phase: 'resources',
      description: 'CDN server delivers CSS much faster than the main web server would'
    });

    newStepData.push({
      stepNumber: 23,
      fromDevice: 'ispRouter',
      toDevice: 'router1',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP forwards CSS back to customer',
      phase: 'resources',
      description: 'CSS file travels back through ISP network to your home'
    });

    newStepData.push({
      stepNumber: 24,
      fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'CSS delivered to browser',
      phase: 'resources',
      description: 'Your browser receives CSS and can now style the webpage beautifully'    });

    // Phase 5: DDoS Attack Simulation - The Dark Side of the Internet! 💀
    newStepData.push({
      stepNumber: 25,
      fromDevice: 'client',
      toDevice: 'webServer',
      packetInfo: {
        source: '🤖 Bot Army (1000+ IPs)',
        destination: '93.184.216.34:443',
        protocol: '💥 TCP SYN Flood',
        size: '500MB/s',
        query: '⚠️ DDoS ATTACK TRAFFIC ⚠️',
      },
      routingInfo: {},
      action: '🚨 MASSIVE DDoS attack launched!',
      phase: 'attack',
      description: '💀 Evil hackers unleash a botnet army to flood the server with fake requests!'
    });

    newStepData.push({
      stepNumber: 26,
      fromDevice: 'webServer',
      toDevice: 'client',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTP Error',
        size: '500 bytes',
        query: '😵 503 Service Unavailable',
      },
      routingInfo: devices.webServer?.routingTable || {},
      action: '😵 Server is drowning in traffic!',
      phase: 'attack',
      description: '💔 Poor server can\'t breathe! It\'s overwhelmed and starts rejecting legitimate users'
    });

    newStepData.push({
      stepNumber: 27,
      fromDevice: 'webServer',
      toDevice: 'client',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: '🛡️ Service Restored! 🎉',
      },      routingInfo: devices.webServer?.routingTable || {},
      action: '🛡️ DDoS protection activated!',
      phase: 'recovery',
      description: '🦸‍♂️ Security heroes deploy anti-DDoS shields and restore normal service!'
    });
    
    setStepData(newStepData);
    setCurrentStep(0);
    setIsStepMode(true);
    
    // Highlight first step
    if (newStepData.length > 0) {
      const firstStep = newStepData[0];
      clearConnectionHighlights();
      clearDeviceHighlights();
      activateDevice(firstStep.fromDevice);
      highlightConnection(firstStep.fromDevice, firstStep.toDevice);
    }
    
    addLogEntry(`Started ${type} simulation - ${SCENARIO_NAMES[currentScenario]}`);
  }, [
    currentScenario,
    devices,
    clearConnectionHighlights,
    clearDeviceHighlights,
    activateDevice,
    highlightConnection,
    addLogEntry,
  ]);

  const nextStep = useCallback(() => {
    if (currentStep < stepData.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      const step = stepData[newStep];
      clearConnectionHighlights();
      clearDeviceHighlights();
      activateDevice(step.fromDevice);
      highlightConnection(step.fromDevice, step.toDevice);
      
      addLogEntry(`📍 Step ${step.stepNumber}: ${step.action}`);    } else {
      // Complete simulation
      setIsStepMode(false);
      setIsAutoPlaying(false);
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
        autoPlayInterval.current = null;
      }
      clearConnectionHighlights();
      clearDeviceHighlights();      addLogEntry('✅ Step-by-step simulation completed!', 'success');
    }
  }, [
    currentStep,
    stepData,
    clearConnectionHighlights,
    clearDeviceHighlights,
    activateDevice,
    highlightConnection,
    addLogEntry,
  ]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      const step = stepData[newStep];
      clearConnectionHighlights();
      clearDeviceHighlights();
      activateDevice(step.fromDevice);
      highlightConnection(step.fromDevice, step.toDevice);
      
      addLogEntry(`📍 Step ${step.stepNumber}: ${step.action}`);
    }
  }, [
    currentStep,
    stepData,
    clearConnectionHighlights,
    clearDeviceHighlights,
    activateDevice,
    highlightConnection,
    addLogEntry,
  ]);

  const startAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
    autoPlayInterval.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < stepData.length - 1) {
          return prev + 1;
        } else {
          setIsAutoPlaying(false);
          setIsStepMode(false);
          if (autoPlayInterval.current) {
            clearInterval(autoPlayInterval.current);
            autoPlayInterval.current = null;
          }
          return prev;
        }
      });
    }, 3000);
  }, [stepData.length]);

  const stopAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
      autoPlayInterval.current = null;
    }
  }, []);

  const resetSteps = useCallback(() => {
    stopAutoPlay();
    setCurrentStep(0);
    clearConnectionHighlights();
    clearDeviceHighlights();
    
    if (stepData.length > 0) {
      const firstStep = stepData[0];
      activateDevice(firstStep.fromDevice);
      highlightConnection(firstStep.fromDevice, firstStep.toDevice);
    }
  }, [stopAutoPlay, clearConnectionHighlights, clearDeviceHighlights, stepData, activateDevice, highlightConnection]);

  // Simulate DDoS attack
  const simulateDDoS = useCallback(async () => {
    addLogEntry('💥 Simulating DDoS attack - sending massive traffic!', 'error');
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        addLogEntry(`🚨 Attack packet ${i + 1} sent`, 'error');
      }, i * 100);
    }
    
    setTimeout(() => {
      addLogEntry('🛡️ Server overwhelmed! This is why DDoS protection is important.', 'error');
    }, 2000);
  }, [addLogEntry]);

  // Update stats
  const updateStats = useCallback((newStats: Partial<NetworkStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, []);

  return {
    // State
    devices,
    currentScenario,
    stats,
    chaosSettings,
    isStepMode,
    currentStep,
    stepData,
    activeConnections,
    logEntries,
    isAutoPlaying,
    connections: NETWORK_CONNECTIONS,
    
    // Actions
    initializeDevices,
    handleDeviceMove,
    activateDevice,
    clearDeviceHighlights,
    highlightConnection,
    clearConnectionHighlights,
    addLogEntry,
    clearLog,
    changeScenario,
    startStepMode,
    nextStep,
    previousStep,
    startAutoPlay,
    stopAutoPlay,
    resetSteps,
    simulateDDoS,
    updateStats,
    setChaosSettings,
  };
};
