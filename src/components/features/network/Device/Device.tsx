import React, { useRef, useCallback, useState } from 'react';
import type { DeviceProps, Position } from '@/types';
import { DEVICE_CONFIG } from '@/utils/constants';
import { Helpers } from '@/utils/helpers';
import styles from './Device.module.css';

export const Device: React.FC<DeviceProps> = ({
  device,
  onDeviceMove,
  onDeviceClick,
  containerRect,
  canvasOffset,
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

    // Stop event from propagating to canvas drag handler
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);

    // Calculate offset relative to the device's position in canvas coordinates
    // (not screen coordinates which include the canvas transform)
    const deviceCenterX = device.position.x;
    const deviceCenterY = device.position.y;
    
    // Convert mouse position to canvas coordinates
    const canvasMouseX = e.clientX - containerRect.left - canvasOffset.x;
    const canvasMouseY = e.clientY - containerRect.top - canvasOffset.y;
    
    // Calculate offset from device center
    const offsetX = canvasMouseX - deviceCenterX;
    const offsetY = canvasMouseY - deviceCenterY;

    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX,
      offsetY,
    };
  }, [device.position, containerRect, canvasOffset]);  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !deviceRef.current || !containerRect) return;

    // Convert mouse position to canvas coordinates immediately
    const canvasMouseX = e.clientX - containerRect.left - canvasOffset.x;
    const canvasMouseY = e.clientY - containerRect.top - canvasOffset.y;

    // Calculate new device center position
    const newX = canvasMouseX - dragData.current.offsetX;
    const newY = canvasMouseY - dragData.current.offsetY;

    // Keep device center within bounds
    const halfWidth = DEVICE_CONFIG.WIDTH / 2;
    const halfHeight = DEVICE_CONFIG.HEIGHT / 2;
    const maxX = containerRect.width - halfWidth;
    const maxY = containerRect.height - halfHeight;

    const boundedX = Helpers.clamp(newX, halfWidth, maxX);
    const boundedY = Helpers.clamp(newY, halfHeight, maxY);

    const newPosition: Position = {
      x: boundedX,
      y: boundedY,
    };

    onDeviceMove(device.id, newPosition);
  }, [isDragging, device.id, onDeviceMove, containerRect, canvasOffset]);

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
  }, [isDragging, device.id, onDeviceClick]);  // Add global mouse event listeners
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
  // Memoize device style for better performance
  const deviceStyle: React.CSSProperties = React.useMemo(() => ({
    left: device.position.x - DEVICE_CONFIG.WIDTH / 2,
    top: device.position.y - DEVICE_CONFIG.HEIGHT / 2,
    width: DEVICE_CONFIG.WIDTH,
    height: DEVICE_CONFIG.HEIGHT,
  }), [device.position.x, device.position.y]);
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
      botnetCloud: 'fas fa-skull-crossbones',
      cloudflareEdge: 'fas fa-shield-alt',
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
      botnetCloud: 'Botnet Army',
      cloudflareEdge: 'Cloudflare',
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
      className={`${styles.device} ${styles[device.type]} ${device.active ? styles.active : ''} ${isDragging ? styles.dragging : ''} ${device.attackState ? styles[device.attackState] : ''}`}
      style={deviceStyle}
      onMouseDown={handleMouseDown}
      data-device-id={device.id}
    >
      <div className={styles.deviceIcon}>
        <i className={getDeviceIcon(device.type)} />
      </div>
      <div className={styles.deviceLabel}>{getDeviceLabel(device.type)}</div>
      <div className={styles.deviceIp}>{device.ip}</div>
    </div>
  );
};