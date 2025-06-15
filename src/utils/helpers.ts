// Utility helper functions
import type { DeviceType, PacketInfo, ScenarioType, Position, WebComponent } from '../types';
import { DEVICE_IPS, PORT_MAP, PROTOCOL_MAP, DEVICE_CONFIG } from './constants';

export class Helpers {
  static getDeviceIP(deviceId: DeviceType): string {
    return DEVICE_IPS[deviceId] || '127.0.0.1';
  }
  static generatePacketInfo(
    _type: string,
    _fromDevice: string,
    toDevice: string,
    currentScenario: ScenarioType
  ): PacketInfo {
    const scenario = currentScenario === 'dns' ? 'dns' : 'https';
    const port = scenario === 'dns' ? PORT_MAP.dns : PORT_MAP.https;
    const protocol = PROTOCOL_MAP[scenario === 'dns' ? 'dns' : 'basic'] || 'HTTPS (TCP)';
    
    return {
      source: '192.168.1.100:' + (54321 + Math.floor(Math.random() * 1000)),
      destination: this.getDeviceIP(toDevice as DeviceType) + ':' + port,
      protocol: protocol,
      size: Math.floor(Math.random() * 1400 + 100) + ' bytes',
    };
  }

  static generateWebComponentPacketInfo(component: WebComponent): PacketInfo {
    const destinations = {
      webServer: '93.184.216.34:443',
      cdnServer: '151.101.1.140:443',
    };
    
    const lastDevice = component.route[component.route.length - 1];
    const destination = destinations[lastDevice as keyof typeof destinations] || '93.184.216.34:443';
    
    return {
      source: '192.168.1.100:' + (54321 + Math.floor(Math.random() * 1000)),
      destination,
      protocol: 'HTTPS (TCP)',
      size: component.size || '10 KB',
      request: `GET /${component.name.toLowerCase().replace(' ', '.')}`,
    };
  }

  static calculateConnectionPoints(
    fromDevice: Position,
    toDevice: Position,
    deviceWidth = DEVICE_CONFIG.WIDTH,
    deviceHeight = DEVICE_CONFIG.HEIGHT
  ) {
    // Calculate direction vector
    const dx = toDevice.x - fromDevice.x;
    const dy = toDevice.y - fromDevice.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    // Calculate edge points (offset from center by half device size)
    const startX = fromDevice.x + unitX * (deviceWidth / 2);
    const startY = fromDevice.y + unitY * (deviceHeight / 2);
    const endX = toDevice.x - unitX * (deviceWidth / 2);
    const endY = toDevice.y - unitY * (deviceHeight / 2);
    
    return { startX, startY, endX, endY };
  }

  static formatTimestamp(): string {
    return new Date().toLocaleTimeString();
  }

  static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  static debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static getDistance(pos1: Position, pos2: Position): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
