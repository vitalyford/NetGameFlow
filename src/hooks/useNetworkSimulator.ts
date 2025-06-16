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
} from '@/types';
import {
  DEVICE_IPS,
  ROUTING_TABLES,
  NETWORK_CONNECTIONS,
  SCENARIO_NAMES
} from '@/utils/constants';
import { Helpers } from '@/utils/helpers';

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
      category: 'system',
    },
  ]);

  // Auto-play state
  const autoPlayInterval = useRef<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  // Initialize devices
  const initializeDevices = useCallback((containerRect: DOMRect, preserveStates = false) => {
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
      // Attack simulation nodes - initially hidden
      botnetCloud: {
        x: padding + usableWidth * 0.08,
        y: padding + usableHeight * 0.85
      },
      cloudflareEdge: {
        x: padding + usableWidth * 0.30,
        y: padding + usableHeight * 0.85
      }
    };

    setDevices(prevDevices => {
      const newDevices: Record<string, DeviceData> = {};

      Object.entries(devicePositions).forEach(([id, position]) => {
        const existingDevice = prevDevices[id];

        newDevices[id] = {
          id,
          position,
          // Preserve existing states if requested, otherwise use defaults
          active: preserveStates && existingDevice ? existingDevice.active : false,
          isDragging: false, // Always reset dragging state
          routingTable: ROUTING_TABLES[id as keyof typeof ROUTING_TABLES] || {},
          ip: DEVICE_IPS[id as keyof typeof DEVICE_IPS] || '127.0.0.1',
          type: id as DeviceType,
          // Preserve attack states when preserveStates is true
          attackState: preserveStates && existingDevice ? existingDevice.attackState :
            (id === 'botnetCloud' || id === 'cloudflareEdge') ? 'normal' : 'normal',
        };
      });

      return newDevices;
    });
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

  const setDeviceAttackState = useCallback((deviceId: string, attackState: 'normal' | 'under-attack' | 'recovery' | 'protected') => {
    setDevices(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        attackState,
      },
    }));
  }, []);

  const clearAllAttackStates = useCallback(() => {
    setDevices(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        updated[id] = { ...updated[id], attackState: 'normal' };
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
  // Enhanced logging function with detailed network information
  const addDetailedLogEntry = useCallback((
    message: string,
    type: LogEntry['type'] = 'info',
    category?: LogEntry['category'],
    details?: LogEntry['details']
  ) => {
    const entry: LogEntry = {
      timestamp: Helpers.formatTimestamp(),
      message,
      type,
      category,
      details,
    };

    setLogEntries(prev => [...prev.slice(-99), entry]); // Keep last 100 entries
  }, []);

  // Legacy simple logging function for backward compatibility
  const addLogEntry = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    addDetailedLogEntry(message, type, 'system');
  }, [addDetailedLogEntry]);

  // Generate realistic network logs based on step data
  const generateNetworkLogsForStep = useCallback((step: StepData) => {
    const { packetInfo, fromDevice, toDevice, stepNumber, phase } = step;

    // Generate a realistic sequence of network events for each step
    const deviceName = (id: string) => {
      const names: Record<string, string> = {
        client: 'Client PC (192.168.1.100)',
        router1: 'Home Router (192.168.1.1)',
        ispRouter: 'ISP Gateway (203.0.113.1)',
        internetRouter1: 'Internet Router A (172.16.0.1)',
        internetRouter2: 'Internet Router B (198.51.100.1)',
        internetRouter3: 'Internet Router C (151.101.0.1)',
        dnsServer: 'Google DNS (8.8.8.8)',
        webServer: 'Web Server (93.184.216.34)',
        cdnServer: 'CDN Edge (151.101.1.140)',
        botnetCloud: 'Botnet C&C Infrastructure',
        cloudflareEdge: 'Cloudflare Edge Server'
      };
      return names[id] || id;
    };

    // 1. Interface status log
    addDetailedLogEntry(
      `Interface eth0 on ${deviceName(fromDevice)} preparing packet transmission`,
      'info',
      'system',
      {
        performanceMetrics: {
          latency: Math.floor(Math.random() * 50) + 1,
          throughput: `${Math.floor(Math.random() * 900) + 100} Mbps`,
          packetLoss: Math.floor(Math.random() * 3)
        }
      }
    );

    // 2. Packet creation/forwarding log
    if (packetInfo) {
      const logMessage = stepNumber <= 10 && phase === 'dns'
        ? `DNS query packet created: ${packetInfo.query}`
        : stepNumber >= 11 && phase === 'request'
          ? `HTTPS request packet created: ${packetInfo.query}`
          : stepNumber >= 20 && phase === 'resources'
            ? `Resource request packet: ${packetInfo.query}`
            : phase === 'attack'
              ? `⚠️ ATTACK TRAFFIC DETECTED: ${packetInfo.query}`
              : phase === 'recovery'
                ? `🛡️ Protection mechanism activated: ${packetInfo.query}`
                : `Packet forwarded: ${packetInfo.protocol}`;

      addDetailedLogEntry(
        logMessage,
        phase === 'attack' ? 'error' : phase === 'recovery' ? 'success' : 'info',
        'packet',
        {
          packetInfo: {
            protocol: packetInfo.protocol,
            source: packetInfo.source,
            destination: packetInfo.destination,
            size: packetInfo.size,
            ttl: packetInfo.ttl,
            query: packetInfo.query,
            originalSource: packetInfo.originalSource,
            originalDestination: packetInfo.originalDestination,
            translatedSource: packetInfo.translatedSource,
            translatedDestination: packetInfo.translatedDestination,
            natPerformed: packetInfo.natPerformed,
            routingDecision: packetInfo.routingDecision,
            nextHop: packetInfo.nextHop
          }
        }
      );
    }

    // 3. Routing decision log
    if (packetInfo?.routingDecision) {
      addDetailedLogEntry(
        `Routing table lookup: ${packetInfo.routingDecision}`,
        'info',
        'routing',
        {
          routingInfo: devices[fromDevice]?.routingTable || {},
          packetInfo: {
            protocol: packetInfo.protocol,
            source: packetInfo.source,
            destination: packetInfo.destination,
            nextHop: packetInfo.nextHop,
            routingDecision: packetInfo.routingDecision
          }
        }
      );
    }

    // 4. NAT operation log
    if (packetInfo?.natPerformed) {
      addDetailedLogEntry(
        `NAT translation performed: ${packetInfo.originalSource} → ${packetInfo.translatedSource}`,
        'success',
        'system',
        {
          packetInfo: {
            protocol: packetInfo.protocol,
            source: packetInfo.source || packetInfo.originalSource || '',
            destination: packetInfo.destination || packetInfo.originalDestination || '',
            originalSource: packetInfo.originalSource,
            translatedSource: packetInfo.translatedSource,
            originalDestination: packetInfo.originalDestination,
            translatedDestination: packetInfo.translatedDestination,
            natPerformed: true
          }
        }
      );
    }

    // 5. Security events for attack phases
    if (phase === 'attack') {
      if (stepNumber === 31) {
        addDetailedLogEntry(
          `🚨 CRITICAL: Massive coordinated attack initiated from global botnet`,
          'error',
          'security',
          {
            securityInfo: {
              threatLevel: 'critical',
              protectionStatus: 'inactive',
              blockReason: 'Volume exceeds detection thresholds'
            },
            performanceMetrics: {
              latency: 2000,
              throughput: '15 Gbps (attack traffic)',
              packetLoss: 75
            }
          }
        );
      } else if (stepNumber === 32) {
        addDetailedLogEntry(
          `🚨 Infrastructure overwhelmed: Router queue buffers at 100% capacity`,
          'error',
          'security',
          {
            securityInfo: {
              threatLevel: 'critical',
              protectionStatus: 'degraded'
            },
            performanceMetrics: {
              latency: 5000,
              throughput: 'Saturated',
              packetLoss: 90
            }
          }
        );
      }
    } else if (phase === 'recovery') {
      if (stepNumber === 34) {
        addDetailedLogEntry(
          `🛡️ Cloudflare DDoS protection: AI threat detection activated`,
          'success',
          'security',
          {
            securityInfo: {
              threatLevel: 'high',
              protectionStatus: 'active',
              blockReason: 'ML pattern recognition: 99.7% confidence malicious'
            },
            performanceMetrics: {
              latency: 25,
              throughput: '800 Mbps (filtered)',
              packetLoss: 2
            }
          }
        );
      }
    }

    // 6. Transmission completion log
    const transmissionTime = Math.floor(Math.random() * 50) + 5;
    addDetailedLogEntry(
      `Packet transmitted to ${deviceName(toDevice)} (${transmissionTime}ms)`,
      'success',
      'system',
      {
        performanceMetrics: {
          latency: transmissionTime,
          throughput: `${Math.floor(Math.random() * 800) + 200} Mbps`,
          packetLoss: 0
        }
      }
    );

    // 7. Special logs for key milestones
    if (stepNumber === 5) {
      addDetailedLogEntry(
        `DNS query successfully delivered to Google's anycast infrastructure`,
        'success',
        'system'
      );
    } else if (stepNumber === 10) {
      addDetailedLogEntry(
        `🎉 DNS resolution complete! www.example.com → 93.184.216.34`,
        'success',
        'system'
      );
    } else if (stepNumber === 18) {
      addDetailedLogEntry(
        `🌐 HTTPS connection established with web server (TLS 1.3)`,
        'success',
        'system'
      );
    } else if (stepNumber === 30) {
      addDetailedLogEntry(
        `🎨 Website fully loaded with CSS styling!`,
        'success',
        'system'
      );
    } else if (stepNumber === 35) {
      addDetailedLogEntry(
        `✅ DDoS attack successfully mitigated - service restored`,
        'success',
        'security',
        {
          securityInfo: {
            threatLevel: 'low',
            protectionStatus: 'active'
          }
        }
      );
    }
  }, [addDetailedLogEntry, devices]);
  const clearLog = useCallback(() => {
    setLogEntries([{
      timestamp: Helpers.formatTimestamp(),
      message: 'Log cleared. Network Simulator ready.',
      type: 'info',
      category: 'system',
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
        networkingConcepts: ['BGP (Border Gateway Protocol)', 'Autonomous Systems (AS)', 'Internet Routing', 'Longest Prefix Match']
      }
    });

    newStepData.push({
      stepNumber: 4,
      fromDevice: 'internetRouter1',
      toDevice: 'internetRouter2',
      packetInfo: {
        source: '98.76.54.32:12345',
        destination: '8.8.8.8:53',
        protocol: 'DNS (UDP)',
        size: '64 bytes',
        query: 'www.example.com A?',
        ttl: 60,
        routingDecision: 'Route to DNS infrastructure',
        nextHop: '198.51.100.1'
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Routing through internet backbone to DNS infrastructure',
      phase: 'dns',
      description: 'Internet Router A forwards the DNS query to Internet Router B which connects to DNS servers',
      detailedExplanation: {
        packetJourney: 'Packet travels through internet backbone routers toward DNS server infrastructure',
        routingLogic: 'Router A forwards to Router B based on routing table: 8.8.8.8/32 reachable via next-hop 198.51.100.1',
        networkingConcepts: ['Internet Backbone Routing', 'Multi-hop Forwarding', 'Specialized Infrastructure']
      }
    });

    newStepData.push({
      stepNumber: 5,
      fromDevice: 'internetRouter2',
      toDevice: 'dnsServer',
      packetInfo: {
        source: '98.76.54.32:12345',
        destination: '8.8.8.8:53',
        protocol: 'DNS (UDP)',
        size: '64 bytes',
        query: 'www.example.com A?',
        ttl: 59,
        routingDecision: 'Direct delivery to Google DNS',
        nextHop: '8.8.8.8'
      },
      routingInfo: devices.internetRouter2?.routingTable || {},
      action: 'Packet reaches Google DNS server',
      phase: 'dns',
      description: 'DNS query reaches Google\'s public DNS server via specialized DNS routing infrastructure',
      detailedExplanation: {
        packetJourney: 'Final hop delivers packet to Google DNS server at 8.8.8.8',
        routingLogic: 'Direct connected route: 8.8.8.8/32 is directly reachable via local interface',
        networkingConcepts: ['DNS Resolution', 'Anycast Routing', 'Public DNS Servers']
      }
    });
    // DNS Response - Return journey (steps 6-10)
    newStepData.push({
      stepNumber: 6,
      fromDevice: 'dnsServer',
      toDevice: 'internetRouter2',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 64,
        routingDecision: 'Return to source via reverse path',
        nextHop: '172.16.0.1'
      },
      routingInfo: devices.dnsServer?.routingTable || {},
      action: 'DNS server responds with IP address',
      phase: 'dns',
      description: 'DNS server resolves www.example.com to 93.184.216.34',
      detailedExplanation: {
        packetJourney: 'DNS server creates response packet with resolved IP address, destination set to original source',
        routingLogic: 'Response destination 98.76.54.32 is not local, route via default gateway back toward ISP',
        networkingConcepts: ['DNS', 'A Record Resolution', 'Reverse Path Routing']
      }
    });

    newStepData.push({
      stepNumber: 7,
      fromDevice: 'internetRouter2',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 63,
        routingDecision: 'Route back through internet backbone',
        nextHop: '203.0.113.1'
      },
      routingInfo: devices.internetRouter2?.routingTable || {},
      action: 'DNS response travels back through internet backbone',
      phase: 'dns',
      description: 'Response travels back through Internet Router B to Internet Router A',
      detailedExplanation: {
        packetJourney: 'Response packet travels back through internet infrastructure to customer ISP',
        routingLogic: '98.76.54.32/32 belongs to customer ISP block, route via learned BGP path',
        networkingConcepts: ['Internet Backbone', 'BGP Path Selection', 'Reverse Path Routing']
      }
    });

    newStepData.push({
      stepNumber: 8,
      fromDevice: 'internetRouter1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 62,
        routingDecision: 'Route back through internet backbone',
        nextHop: '203.0.113.1'
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Response travels back through internet',
      phase: 'dns',
      description: 'Internet backbone routes response back toward customer ISP',
      detailedExplanation: {
        packetJourney: 'Response packet travels back through internet infrastructure to customer ISP',
        routingLogic: '98.76.54.32/32 belongs to customer ISP block, route via learned BGP path',
        networkingConcepts: ['Internet Backbone', 'BGP Path Selection', 'Reverse Path Routing']
      }
    });
    newStepData.push({
      stepNumber: 9,
      fromDevice: 'ispRouter',
      toDevice: 'router1',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '98.76.54.32:12345',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        ttl: 61,
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
      stepNumber: 10,
      fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '192.168.1.100:54321',
        protocol: 'DNS (UDP)',
        size: '128 bytes',
        query: 'www.example.com → 93.184.216.34',
        originalDestination: '98.76.54.32:12345',
        translatedDestination: '192.168.1.100:54321',
        natPerformed: true,
        ttl: 60,
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
    // Phase 2: Initial HTTP Request (6 steps)
    newStepData.push({
      stepNumber: 11,
      fromDevice: 'client',
      toDevice: 'router1',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
        ttl: 64,
        routingDecision: 'Route to default gateway',
        nextHop: '192.168.1.1'
      },
      routingInfo: devices.client?.routingTable || {},
      action: 'Sending HTTPS request to website',
      phase: 'request',
      description: 'Now that we have the IP, request the website over secure HTTPS',
      detailedExplanation: {
        packetJourney: 'Browser creates HTTPS request packet destined for resolved IP address',
        routingLogic: 'Destination 93.184.216.34 is not in local subnet, route via default gateway',
        networkingConcepts: ['HTTPS', 'TCP', 'Default Gateway']
      }
    });
    newStepData.push({
      stepNumber: 12,
      fromDevice: 'router1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '192.168.1.100:45678',
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
      stepNumber: 10,
      fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '8.8.8.8:53',
        destination: '192.168.1.100:54321', protocol: 'DNS (UDP)',
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
    // Phase 2: Initial HTTP Request (6 steps)
    newStepData.push({
      stepNumber: 13,
      fromDevice: 'client',
      toDevice: 'router1',
      packetInfo: {
        source: '192.168.1.100:45678',
        destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
        ttl: 64,
        routingDecision: 'Route to default gateway',
        nextHop: '192.168.1.1'
      },
      routingInfo: devices.client?.routingTable || {},
      action: 'Sending HTTPS request to website',
      phase: 'request',
      description: 'Now that we have the IP, request the website over secure HTTPS',
      detailedExplanation: {
        packetJourney: 'Browser creates HTTPS request packet destined for resolved IP address',
        routingLogic: 'Destination 93.184.216.34 is not in local subnet, route via default gateway',
        networkingConcepts: ['HTTPS', 'TCP', 'Default Gateway']
      }
    });
    newStepData.push({
      stepNumber: 14,
      fromDevice: 'router1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '192.168.1.100:45678', destination: '93.184.216.34:443',
        protocol: 'HTTPS (TCP)',
        size: '1420 bytes',
        query: 'GET / HTTP/1.1',
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'Router forwards HTTPS request to ISP',
      phase: 'request',
      description: 'Home router forwards your HTTPS request to the ISP'
    });
    newStepData.push({
      stepNumber: 13,
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
    });
    newStepData.push({
      stepNumber: 14,
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
    });
    newStepData.push({
      stepNumber: 15,
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
    });
    // Phase 3: Web Server Response (5 steps)
    newStepData.push({
      stepNumber: 16,
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
    });
    newStepData.push({
      stepNumber: 17,
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
    });
    newStepData.push({
      stepNumber: 18,
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
    });
    newStepData.push({
      stepNumber: 19,
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
    });
    newStepData.push({
      stepNumber: 20,
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
      description: 'Your computer receives the HTML and starts rendering the webpage'
    });
    // Phase 4: CDN Resource Fetching (6 steps - through proper internet routing)
    newStepData.push({
      stepNumber: 21,
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
      stepNumber: 22,
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
      stepNumber: 23,
      fromDevice: 'ispRouter',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '192.168.1.100:45679',
        destination: '151.101.1.140:443',
        protocol: 'HTTPS (TCP)',
        size: '512 bytes',
        query: 'GET /style.css',
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP routes CDN request through internet',
      phase: 'resources',
      description: 'ISP router determines path to CDN through internet backbone'
    });

    newStepData.push({
      stepNumber: 24,
      fromDevice: 'internetRouter1',
      toDevice: 'internetRouter3',
      packetInfo: {
        source: '192.168.1.100:45679',
        destination: '151.101.1.140:443',
        protocol: 'HTTPS (TCP)',
        size: '512 bytes',
        query: 'GET /style.css',
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Routing to CDN through internet backbone',
      phase: 'resources',
      description: 'Request travels through internet infrastructure to reach CDN edge server'
    });

    newStepData.push({
      stepNumber: 25,
      fromDevice: 'internetRouter3',
      toDevice: 'cdnServer',
      packetInfo: {
        source: '192.168.1.100:45679',
        destination: '151.101.1.140:443',
        protocol: 'HTTPS (TCP)',
        size: '512 bytes',
        query: 'GET /style.css',
      },
      routingInfo: devices.internetRouter3?.routingTable || {},
      action: 'Request reaches CDN server',
      phase: 'resources',
      description: 'Request finally reaches the nearby CDN edge server for fast content delivery'
    });

    // CDN Response Journey - proper routing back through internet infrastructure
    newStepData.push({
      stepNumber: 26,
      fromDevice: 'cdnServer',
      toDevice: 'internetRouter3',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
        ttl: 64,
        routingDecision: 'Return via internet backbone',
        nextHop: '172.16.0.1'
      },
      routingInfo: devices.cdnServer?.routingTable || {},
      action: 'CDN sends CSS response back through internet',
      phase: 'resources',
      description: 'CDN server delivers cached CSS file, routing back through internet infrastructure',
      detailedExplanation: {
        packetJourney: 'CDN edge server creates response packet with CSS content, routes back via internet backbone',
        routingLogic: 'Destination 192.168.1.100 is not local, route via default gateway back through internet',
        networkingConcepts: ['CDN Edge Servers', 'Content Caching', 'Optimized Delivery', 'Reverse Path Routing']
      }
    });
    newStepData.push({
      stepNumber: 27,
      fromDevice: 'internetRouter3',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
        ttl: 63,
        routingDecision: 'Internet backbone routing',
        nextHop: '203.0.113.1'
      },
      routingInfo: devices.internetRouter3?.routingTable || {},
      action: 'CSS response travels through internet backbone',
      phase: 'resources',
      description: 'Response packet travels back through internet infrastructure toward customer ISP',
      detailedExplanation: {
        packetJourney: 'CSS response travels back through multiple internet routers using optimal path',
        routingLogic: 'BGP routing tables determine best path back to customer ISP network',
        networkingConcepts: ['Internet Backbone', 'Optimized Delivery', 'BGP Path Selection']
      }
    });

    newStepData.push({
      stepNumber: 28,
      fromDevice: 'internetRouter1',
      toDevice: 'ispRouter',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
        ttl: 62,
        routingDecision: 'Route to customer ISP',
        nextHop: '98.76.54.32'
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'CSS response reaches customer ISP',
      phase: 'resources',
      description: 'Internet router forwards CSS response to customer ISP',
      detailedExplanation: {
        packetJourney: 'Response enters customer ISP network from internet backbone',
        routingLogic: 'ISP border router receives response destined for customer IP block',
        networkingConcepts: ['ISP Border Gateway', 'Customer IP Blocks', 'Last Mile Delivery']
      }
    });

    newStepData.push({
      stepNumber: 29,
      fromDevice: 'ispRouter',
      toDevice: 'router1',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
        ttl: 61,
        routingDecision: 'Route to customer premises',
        nextHop: '98.76.54.32'
      },
      routingInfo: devices.ispRouter?.routingTable || {},
      action: 'ISP forwards CSS back to customer',
      phase: 'resources',
      description: 'ISP router recognizes customer public IP and routes to customer router',
      detailedExplanation: {
        packetJourney: 'ISP routes response to specific customer connection based on IP assignment',
        routingLogic: 'Customer IP 98.76.54.32 is assigned to this customer line',
        networkingConcepts: ['Customer Premises Equipment', 'Customer IP Assignment', 'Last Mile Delivery']
      }
    });

    newStepData.push({
      stepNumber: 30, fromDevice: 'router1',
      toDevice: 'client',
      packetInfo: {
        source: '151.101.1.140:443',
        destination: '192.168.1.100:45679',
        protocol: 'HTTPS (TCP)',
        size: '4096 bytes',
        query: 'CSS Stylesheet',
        originalDestination: '98.76.54.32:12346',
        translatedDestination: '192.168.1.100:45679',
        natPerformed: true,
        ttl: 60,
        routingDecision: 'NAT reverse translation and local delivery',
        nextHop: '192.168.1.100'
      },
      routingInfo: devices.router1?.routingTable || {},
      action: 'CSS delivered to browser',
      phase: 'resources',
      description: 'Home router performs reverse NAT and delivers CSS to your browser - webpage now loads with beautiful styling!',
      detailedExplanation: {
        packetJourney: 'Router performs reverse NAT and delivers CSS content to browser',
        routingLogic: 'NAT state table lookup and local network delivery to client',
        networkingConcepts: ['Reverse NAT', 'Content Delivery', 'Web Resource Loading', 'Browser Rendering']
      }
    });
    // Phase 5: Realistic DDoS Attack with Botnet and Cloudflare Protection
    newStepData.push({
      stepNumber: 31,
      fromDevice: 'botnetCloud',
      toDevice: 'internetRouter1',
      packetInfo: {
        source: 'Botnet Command & Control',
        destination: 'Internet Infrastructure',
        protocol: 'Coordinated Multi-Vector Attack',
        size: 'Massive Traffic Volume',
        query: 'Attack Initiation Protocol',
        request: 'Activate all compromised devices globally',
        attackVectors: ['TCP SYN Flood', 'HTTP GET/POST Flood', 'UDP Amplification', 'Slowloris', 'Application Layer Attacks'],
        maliciousIPs: ['50,000+ infected IoT devices', 'Hijacked cloud servers', 'Compromised residential routers', 'Infected mobile devices']
      },
      routingInfo: devices.botnetCloud?.routingTable || {},
      action: 'Criminal botnet operators activate global zombie army',
      phase: 'attack',
      description: 'Cybercriminals remotely activate 50,000+ compromised devices worldwide. Each infected computer becomes a weapon in a coordinated assault on critical internet infrastructure.',
      detailedExplanation: {
        packetJourney: 'Botnet command servers send attack instructions to infected devices across continents',
        routingLogic: 'Distributed attack sources overwhelm multiple network entry points simultaneously',
        networkingConcepts: ['Distributed Denial of Service', 'Botnet Command & Control', 'Amplification Attacks', 'Multi-Vector Assault']
      }
    });
    newStepData.push({
      stepNumber: 32,
      fromDevice: 'internetRouter1',
      toDevice: 'webServer',
      packetInfo: {
        source: 'Global Attack Traffic',
        destination: '93.184.216.34:443',
        protocol: 'Overwhelming Network Load',
        size: '15 Gbps sustained attack',
        query: 'Server resource exhaustion',
        request: 'Force service outage',
        attackVectors: ['SYN Flood', 'HTTP Flood', 'UDP Amplification', 'Slowloris'],
        errorDetails: 'Network capacity exceeded by 300%'
      },
      routingInfo: devices.internetRouter1?.routingTable || {},
      action: 'Malicious traffic floods internet infrastructure toward target server',
      phase: 'attack',
      description: 'Attack traffic overwhelms internet routers and network links. Legitimate users cannot reach the website as malicious packets consume all available bandwidth and server resources.',
      detailedExplanation: {
        packetJourney: 'Massive volume of attack packets travels through internet infrastructure, congesting routers and links',
        routingLogic: 'Router queues overflow as attack traffic exceeds normal capacity by orders of magnitude',
        networkingConcepts: ['Network Congestion', 'Bandwidth Saturation', 'Router Queue Management', 'Quality of Service Degradation']
      }
    });

    newStepData.push({
      stepNumber: 33,
      fromDevice: 'webServer',
      toDevice: 'client',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTP 503 Service Unavailable',
        size: '500 bytes',
        query: 'Error: Server resources exhausted',
        request: 'Service temporarily unavailable',
        errorDetails: 'CPU: 100%, Memory: 100%, Network: Saturated, Connections: Maxed'
      },
      routingInfo: devices.webServer?.routingTable || {},
      action: 'Web server resources completely exhausted - legitimate users denied service',
      phase: 'attack',
      description: 'The attack succeeds. Server hardware cannot handle the massive load. CPU utilization hits 100%, memory is exhausted, and network interfaces are saturated. The website becomes completely inaccessible to real users.',
      detailedExplanation: {
        packetJourney: 'Server attempts to respond but lacks resources to process legitimate requests',
        routingLogic: 'All server capacity consumed by processing malicious traffic',
        networkingConcepts: ['Resource Exhaustion', 'Service Degradation', 'Denial of Service Impact', 'System Overload']
      }
    });

    newStepData.push({
      stepNumber: 34,
      fromDevice: 'cloudflareEdge',
      toDevice: 'botnetCloud',
      packetInfo: {
        source: 'Cloudflare Global Network',
        destination: 'Attack Sources',
        protocol: 'DDoS Mitigation Activated',
        size: 'Traffic Analysis & Filtering',
        query: 'Intelligent threat detection',
        request: 'Deploy protection measures',
        protectionFeatures: ['ML-based traffic analysis', 'Rate limiting per IP', 'Behavioral fingerprinting', 'Challenge-response validation']
      },
      routingInfo: devices.cloudflareEdge?.routingTable || {},
      action: 'Cloudflare DDoS protection automatically detects and responds to the attack',
      phase: 'recovery',
      description: 'Advanced AI-powered systems instantly recognize the attack pattern. Cloudflare\'s global network activates sophisticated countermeasures, filtering malicious traffic while allowing legitimate users through.',
      detailedExplanation: {
        packetJourney: 'Protection systems analyze traffic patterns and implement filtering rules across global edge locations',
        routingLogic: 'Intelligent routing directs clean traffic to origin server while dropping malicious packets',
        networkingConcepts: ['Traffic Analysis', 'Machine Learning Detection', 'Global Anycast Network', 'Intelligent Filtering']
      }
    });

    newStepData.push({
      stepNumber: 35,
      fromDevice: 'webServer',
      toDevice: 'client',
      packetInfo: {
        source: '93.184.216.34:443',
        destination: '192.168.1.100:45678',
        protocol: 'HTTPS (TCP)',
        size: '2048 bytes',
        query: 'HTTP/1.1 200 OK - Service Restored',
        request: 'Normal website operation resumed',
        protectionFeatures: ['Clean traffic only', 'Attack traffic filtered', 'Performance optimized', 'Security monitoring active']
      },
      routingInfo: devices.webServer?.routingTable || {},
      action: 'Service completely restored - clean traffic reaches server while attack is neutralized',
      phase: 'recovery',
      description: 'Victory! Cloudflare\'s protection creates an impenetrable shield. The botnet attack is completely neutralized. Server resources return to normal levels. Legitimate users can access the website again without any issues.',
      detailedExplanation: {
        packetJourney: 'Only verified legitimate traffic reaches the origin server through Cloudflare\'s protection network',
        routingLogic: 'Multi-layered filtering ensures malicious packets never reach the target infrastructure',
        networkingConcepts: ['DDoS Mitigation Success', 'Traffic Scrubbing', 'Service Restoration', 'Security vs Performance Balance']
      }
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

      // Generate initial network logs for the first step
      generateNetworkLogsForStep(firstStep);
    }

    addDetailedLogEntry(
      `🚀 Started ${type} simulation - ${SCENARIO_NAMES[currentScenario]}`,
      'success',
      'system',
      {
        performanceMetrics: {
          latency: 0,
          throughput: 'Ready',
          packetLoss: 0
        }
      }
    );
  }, [
    currentScenario,
    devices,
    clearConnectionHighlights,
    clearDeviceHighlights,
    activateDevice,
    highlightConnection,
    generateNetworkLogsForStep,
    addDetailedLogEntry,
  ]);
  const nextStep = useCallback(() => {
    if (currentStep < stepData.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);

      const step = stepData[newStep];
      clearConnectionHighlights();
      clearDeviceHighlights();
      // Handle special attack states for DDoS visualization
      if (step.phase === 'attack') {
        if (step.stepNumber === 31) {
          // DDoS attack start - show botnet and mark infrastructure as under attack
          setDeviceAttackState('botnetCloud', 'under-attack');
          setDeviceAttackState('internetRouter1', 'under-attack');
          setDeviceAttackState('internetRouter2', 'under-attack');
          setDeviceAttackState('internetRouter3', 'under-attack');
        } else if (step.stepNumber === 32) {
          // Traffic flooding through infrastructure
          setDeviceAttackState('ispRouter', 'under-attack');
          setDeviceAttackState('webServer', 'under-attack');
        } else if (step.stepNumber === 33) {
          // Server overwhelmed - focus attack state on web server
          setDeviceAttackState('webServer', 'under-attack');
        }
      } else if (step.phase === 'recovery') {
        if (step.stepNumber === 34) {
          // Cloudflare protection activates
          setDeviceAttackState('cloudflareEdge', 'recovery');
          setDeviceAttackState('botnetCloud', 'normal');
          // Clear attack states from infrastructure
          setDeviceAttackState('internetRouter1', 'normal');
          setDeviceAttackState('internetRouter2', 'normal');
          setDeviceAttackState('internetRouter3', 'normal');
          setDeviceAttackState('ispRouter', 'normal');
        } else if (step.stepNumber === 35) {
          // Service fully restored
          setDeviceAttackState('cloudflareEdge', 'protected');
          setDeviceAttackState('webServer', 'protected');
        }
      } else {
        // Normal operations - clear attack states and hide special devices
        clearAllAttackStates();
      }
      activateDevice(step.fromDevice);
      highlightConnection(step.fromDevice, step.toDevice);

      // Generate realistic network logs for this step
      generateNetworkLogsForStep(step);

      addLogEntry(`📍 Step ${step.stepNumber}: ${step.action}`);
    } else {
      // Complete simulation
      setIsStepMode(false);
      setIsAutoPlaying(false);
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
        autoPlayInterval.current = null;
      }
      clearConnectionHighlights();
      clearDeviceHighlights();
      clearAllAttackStates();

      addLogEntry('✅ Step-by-step simulation completed!', 'success');
    }
  }, [
    currentStep,
    stepData,
    clearConnectionHighlights,
    clearDeviceHighlights,
    setDeviceAttackState,
    clearAllAttackStates,
    activateDevice,
    highlightConnection,
    generateNetworkLogsForStep,
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

      // Generate realistic network logs for this step
      generateNetworkLogsForStep(step);

      addLogEntry(`📍 Step ${step.stepNumber}: ${step.action}`);
    }
  }, [
    currentStep,
    stepData,
    clearConnectionHighlights,
    clearDeviceHighlights,
    activateDevice,
    highlightConnection,
    generateNetworkLogsForStep,
    addLogEntry,
  ]);
  const startAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
    autoPlayInterval.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < stepData.length - 1) {
          const newStep = prev + 1;
          const step = stepData[newStep];

          // Apply the same highlighting logic as nextStep
          clearConnectionHighlights();
          clearDeviceHighlights();

          // Handle special attack states for DDoS visualization
          if (step.phase === 'attack') {
            if (step.stepNumber === 31) {
              // DDoS attack start - show botnet and mark infrastructure as under attack
              setDeviceAttackState('botnetCloud', 'under-attack');
              setDeviceAttackState('internetRouter1', 'under-attack');
              setDeviceAttackState('internetRouter2', 'under-attack');
              setDeviceAttackState('internetRouter3', 'under-attack');
            } else if (step.stepNumber === 32) {
              // Traffic flooding through infrastructure
              setDeviceAttackState('ispRouter', 'under-attack');
              setDeviceAttackState('webServer', 'under-attack');
            } else if (step.stepNumber === 33) {
              // Server overwhelmed - focus attack state on web server
              setDeviceAttackState('webServer', 'under-attack');
            }
          } else if (step.phase === 'recovery') {
            if (step.stepNumber === 34) {
              // Cloudflare protection activates
              setDeviceAttackState('cloudflareEdge', 'recovery');
              setDeviceAttackState('botnetCloud', 'normal');
              // Clear attack states from infrastructure
              setDeviceAttackState('internetRouter1', 'normal');
              setDeviceAttackState('internetRouter2', 'normal');
              setDeviceAttackState('internetRouter3', 'normal');
              setDeviceAttackState('ispRouter', 'normal');
            } else if (step.stepNumber === 35) {
              // Service fully restored
              setDeviceAttackState('cloudflareEdge', 'protected');
              setDeviceAttackState('webServer', 'protected');
            }
          } else {
            // Normal operations - clear attack states and hide special devices
            clearAllAttackStates();
          }
          activateDevice(step.fromDevice);
          highlightConnection(step.fromDevice, step.toDevice);

          // Generate realistic network logs for this step
          generateNetworkLogsForStep(step);

          addLogEntry(`📍 Step ${step.stepNumber}: ${step.action}`);

          return newStep;
        } else {
          // Complete simulation
          setIsAutoPlaying(false);
          setIsStepMode(false);
          if (autoPlayInterval.current) {
            clearInterval(autoPlayInterval.current);
            autoPlayInterval.current = null;
          }
          clearConnectionHighlights();
          clearDeviceHighlights();
          clearAllAttackStates();

          addLogEntry('✅ Step-by-step simulation completed!', 'success');
          return prev;
        }
      });
    }, 3000);
  }, [
    stepData,
    clearConnectionHighlights,
    clearDeviceHighlights,
    setDeviceAttackState,
    clearAllAttackStates,
    activateDevice,
    highlightConnection,
    generateNetworkLogsForStep,
    addLogEntry,
  ]);

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

  // Stop and reset simulation completely
  const stopSimulation = useCallback(() => {
    // Stop any auto-play
    stopAutoPlay();

    // Exit step mode completely
    setIsStepMode(false);
    setCurrentStep(0);
    setStepData([]);

    // Clear all visual highlights and states
    clearConnectionHighlights();
    clearDeviceHighlights();
    clearAllAttackStates();

    // Reset active connections
    setActiveConnections(new Set());

    // Clear the log with a fresh start message
    setLogEntries([{
      timestamp: Helpers.formatTimestamp(),
      message: 'Network Simulator reset. Ready to start a new simulation!',
      type: 'info',
      category: 'system',
    }]);

    addLogEntry('🔄 Simulation stopped and reset to initial state', 'info');
  }, [
    stopAutoPlay,
    clearConnectionHighlights,
    clearDeviceHighlights,
    clearAllAttackStates,
    addLogEntry,
  ]);

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
    previousStep, startAutoPlay,
    stopAutoPlay,
    resetSteps,
    stopSimulation,
    simulateDDoS,
    updateStats,
    setChaosSettings,
    setDeviceAttackState,
    clearAllAttackStates,
  };
};
