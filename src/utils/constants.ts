// Constants and configuration for the Network Simulator
import type { DeviceType, Connection, WebComponent, RoutingTable } from '../types';

export const DEVICE_CONFIG = {
  WIDTH: 100,
  HEIGHT: 90,
  DRAG_THRESHOLD: 5,
} as const;

export const PACKET_CONFIG = {
  SIZE: 12,
  ANIMATION_DURATION: 1500,
  GLOW_DURATION: 1000,
} as const;

export const DEVICE_IPS: Record<DeviceType, string> = {
  client: '192.168.1.100',
  router1: '192.168.1.1',
  ispRouter: '10.0.0.1',
  internetRouter1: '203.0.113.1',
  internetRouter2: '198.51.100.1',
  internetRouter3: '203.0.113.15',
  dnsServer: '8.8.8.8',
  webServer: '93.184.216.34',
  cdnServer: '151.101.1.140',
  botnetCloud: '🌐 Global Botnet',
  cloudflareEdge: '🛡️ CF Protection',
};

export const PORT_MAP = {
  dns: 53,
  http: 80,
  https: 443,
  tcp: 443,
} as const;

export const PROTOCOL_MAP = {
  dns: 'DNS (UDP)',
  basic: 'HTTPS (TCP)',
  tcp: 'TCP',
} as const;

export const SCENARIO_NAMES = {
  basic: 'Basic Packet Flow',
  dns: 'DNS Resolution',
  tcp: 'TCP Handshake',
  routing: 'Packet Routing',
} as const;

export const NETWORK_CONNECTIONS: Connection[] = [
  { from: 'client', to: 'router1' },
  { from: 'router1', to: 'ispRouter' },
  { from: 'ispRouter', to: 'internetRouter1' },
  { from: 'internetRouter1', to: 'internetRouter2' },
  { from: 'internetRouter1', to: 'internetRouter3' },
  { from: 'internetRouter2', to: 'dnsServer' },
  { from: 'internetRouter3', to: 'webServer' },
  { from: 'internetRouter3', to: 'cdnServer' },
  { from: 'internetRouter2', to: 'internetRouter3' },
  // Attack simulation connections
  { from: 'botnetCloud', to: 'internetRouter1' },
  { from: 'botnetCloud', to: 'internetRouter2' },
  { from: 'cloudflareEdge', to: 'botnetCloud' },
  { from: 'cloudflareEdge', to: 'webServer' },
];

export const WEB_COMPONENTS: WebComponent[] = [
  {
    name: 'HTML Document',
    source: 'www.example.com',
    type: 'html',
    route: ['client', 'router1', 'ispRouter', 'internetRouter1', 'internetRouter3', 'webServer'],
    size: '45 KB',
  },
  {
    name: 'CSS Stylesheet',
    source: 'cdn.example.com',
    type: 'css',
    route: ['client', 'router1', 'ispRouter', 'internetRouter1', 'internetRouter3', 'cdnServer'],
    size: '12 KB',
  },
  {
    name: 'JavaScript File',
    source: 'cdn.example.com',
    type: 'js',
    route: ['client', 'router1', 'ispRouter', 'internetRouter1', 'internetRouter3', 'cdnServer'],
    size: '85 KB',
  },
  {
    name: 'Logo Image',
    source: 'images.example.com',
    type: 'image',
    route: ['client', 'router1', 'ispRouter', 'internetRouter1', 'internetRouter2', 'internetRouter3', 'cdnServer'],
    size: '156 KB',
  },
];

export const COMPONENT_ICONS = {
  html: 'fa-file-code',
  css: 'fa-palette',
  js: 'fa-cogs',
  image: 'fa-image',
} as const;

export const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
] as const;

export const ROUTING_TABLES: Record<DeviceType, RoutingTable> = {
  client: {
    'Default Gateway': '192.168.1.1',
    'Local Network': '192.168.1.0/24',
    'DNS Server': '8.8.8.8',
  },
  router1: {
    'Local Network': '192.168.1.0/24',
    'ISP Gateway': '10.0.0.1',
    'Internet': '0.0.0.0/0 via 10.0.0.1',
  },
  ispRouter: {
    'Customer Networks': '192.168.0.0/16',
    'Internet Core': '203.0.113.0/24',
    'BGP Peers': 'Multiple AS paths',
  },
  internetRouter1: {
    'Upstream': '198.51.100.0/24',
    'Downstream': '203.0.113.0/24',
    'Peer Networks': 'AS64512, AS64513',
  },
  internetRouter2: {
    'DNS Networks': '8.8.8.0/24',
    'CDN Networks': '151.101.0.0/16',
    'Transit': 'AS64514',
  },
  internetRouter3: {
    'Web Servers': '93.184.216.0/24',
    'Load Balancers': '203.0.113.0/24',
    'Transit': 'AS64515',
  },
  dnsServer: {
    'Authoritative': '.com, .org zones',
    'Recursive': 'Global cache',
    'Anycast': '8.8.8.8 worldwide',
  },
  webServer: {
    'Virtual Hosts': 'www.example.com',
    'Load Balancer': '203.0.113.15',
    'CDN Origin': 'Push to edge servers',
  },  cdnServer: {
    'Origin Server': '93.184.216.34',
    'Cache TTL': '3600 seconds',
    'Edge Locations': 'Global distribution',
  },
  botnetCloud: {
    'Compromised Devices': '50,000+ zombies',
    'Command & Control': 'Dark web servers',
    'Attack Vectors': 'TCP SYN, HTTP flood',
  },
  cloudflareEdge: {
    'DDoS Protection': 'ML-based filtering',
    'Rate Limiting': '100 req/sec per IP',
    'Sink Holes': 'Traffic absorption',
  },
};
