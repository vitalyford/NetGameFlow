import React, { useRef, useCallback, useState } from 'react';
import type { DeviceProps, Position } from '../types';
import { DEVICE_CONFIG } from '../utils/constants';
import { Helpers } from '../utils/helpers';
import './Device.css';

export const Device: React.FC<DeviceProps> = ({
  device,
  onDeviceMove,
  onDeviceClick,
  containerRect,
}) => {
  const deviceRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragData = useRef<{
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  }>({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 });  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    
    const rect = deviceRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate the offset from the mouse position to the top-left of the device
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: offsetX,
      offsetY: offsetY,
    };
    
    e.preventDefault();
  }, []);const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !deviceRef.current) return;
    
    // Get a fresh container rect to ensure we have the latest bounds
    const currentContainer = deviceRef.current.closest('.network-topology') as HTMLElement;
    if (!currentContainer) return;
    
    const freshContainerRect = currentContainer.getBoundingClientRect();
    
    const newX = e.clientX - freshContainerRect.left - dragData.current.offsetX;
    const newY = e.clientY - freshContainerRect.top - dragData.current.offsetY;
    
    // Keep device within bounds
    const maxX = freshContainerRect.width - DEVICE_CONFIG.WIDTH;
    const maxY = freshContainerRect.height - DEVICE_CONFIG.HEIGHT;
    
    const boundedX = Helpers.clamp(newX, 0, maxX);
    const boundedY = Helpers.clamp(newY, 0, maxY);
    
    const newPosition: Position = {
      x: boundedX + DEVICE_CONFIG.WIDTH / 2,
      y: boundedY + DEVICE_CONFIG.HEIGHT / 2,
    };
    
    onDeviceMove(device.id, newPosition);
  }, [isDragging, device.id, onDeviceMove]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      
      // Check if this was a click vs drag
      const { startX, startY } = dragData.current;
      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);
      
      if (deltaX <= DEVICE_CONFIG.DRAG_THRESHOLD && deltaY <= DEVICE_CONFIG.DRAG_THRESHOLD) {
        onDeviceClick(device.id);
      }
    }
  }, [isDragging, device.id, onDeviceClick]);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const deviceStyle: React.CSSProperties = {
    left: device.position.x - DEVICE_CONFIG.WIDTH / 2,
    top: device.position.y - DEVICE_CONFIG.HEIGHT / 2,
    width: DEVICE_CONFIG.WIDTH,
    height: DEVICE_CONFIG.HEIGHT,
  };

  const getDeviceIcon = (deviceType: string) => {
    const icons: Record<string, string> = {
      client: 'fas fa-laptop',
      router1: 'fas fa-wifi',
      ispRouter: 'fas fa-server',
      internetRouter1: 'fas fa-globe',
      internetRouter2: 'fas fa-globe',
      internetRouter3: 'fas fa-globe',
      dnsServer: 'fas fa-address-book',
      webServer: 'fas fa-database',
      cdnServer: 'fas fa-rocket',
    };
    return icons[deviceType] || 'fas fa-circle';
  };
  const getDeviceLabel = (deviceType: string) => {
    const labels: Record<string, string> = {
      client: 'Your Computer',
      router1: 'Home Router',
      ispRouter: 'ISP Router',
      internetRouter1: 'Internet Router A',
      internetRouter2: 'Internet Router B',
      internetRouter3: 'Internet Router C',
      dnsServer: 'DNS Server',
      webServer: 'Web Server',
      cdnServer: 'CDN Server',
    };
    return labels[deviceType] || deviceType;
  };

  // Don't render if containerRect is invalid
  if (!containerRect || containerRect.width === 0 || containerRect.height === 0) {
    return null;
  }
  return (
    <div
      ref={deviceRef}
      className={`device ${device.type} ${device.active ? 'active' : ''} ${isDragging ? 'dragging' : ''} ${device.attackState || ''}`}
      style={deviceStyle}
      onMouseDown={handleMouseDown}
      data-device-id={device.id}
    >
      <div className="device-icon">
        <i className={getDeviceIcon(device.type)} />
      </div>
      <div className="device-label">{getDeviceLabel(device.type)}</div>
      <div className="device-ip">{device.ip}</div>
    </div>
  );
};
