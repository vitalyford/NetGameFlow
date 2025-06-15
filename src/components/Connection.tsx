import React from 'react';
import type { ConnectionProps } from '../types';
import { Helpers } from '../utils/helpers';
import './Connection.css';

export const Connection: React.FC<ConnectionProps> = ({
  connections,
  devices,
  activeConnections,
  currentStepConnection,
}) => {
  return (
    <svg className="connections" width="100%" height="100%">      <defs>
        <marker
          id="arrowhead"
          markerWidth="5"
          markerHeight="3"
          refX="5"
          refY="1.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 5 1.5, 0 3" fill="#bdc3c7" />
        </marker>
        <marker
          id="arrowhead-active"
          markerWidth="5"
          markerHeight="3"
          refX="5"
          refY="1.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 5 1.5, 0 3" fill="#e74c3c" />
        </marker>
        <marker
          id="arrowhead-current"
          markerWidth="6"
          markerHeight="4"
          refX="6"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 6 2, 0 4" fill="#3498db" />
        </marker>
      </defs>
      
      {connections.map((conn, index) => {
        const fromDevice = devices[conn.from];
        const toDevice = devices[conn.to];
        
        if (!fromDevice || !toDevice) return null;
        
        const { startX, startY, endX, endY } = Helpers.calculateConnectionPoints(
          fromDevice.position,
          toDevice.position
        );
        
        const connectionKey = `${conn.from}-${conn.to}`;
        const reverseKey = `${conn.to}-${conn.from}`;
        const isActive = activeConnections.has(connectionKey) || 
                        activeConnections.has(reverseKey);
          // Check if this connection matches the current step
        const isCurrentStep = currentStepConnection && connectionKey === currentStepConnection;
        const isCurrentStepReverse = currentStepConnection && reverseKey === currentStepConnection;
        
        // Determine if we need to reverse the line direction for the arrow
        const shouldReverse = isCurrentStepReverse;
        
        // Calculate actual start/end points based on direction
        const actualStartX = shouldReverse ? endX : startX;
        const actualStartY = shouldReverse ? endY : startY;
        const actualEndX = shouldReverse ? startX : endX;
        const actualEndY = shouldReverse ? startY : endY;
          // Only show arrow if it's the current step
        const showArrow = isCurrentStep || isCurrentStepReverse;
        const markerType = (isCurrentStep || isCurrentStepReverse) ? 'arrowhead-current' : 
                          isActive ? 'arrowhead-active' : 'arrowhead';
        
        return (
          <line
            key={`connection-${index}`}
            x1={actualStartX}
            y1={actualStartY}
            x2={actualEndX}
            y2={actualEndY}
            className={`connection-line ${isActive ? 'active' : ''} ${(isCurrentStep || isCurrentStepReverse) ? 'current-step' : ''}`}
            markerEnd={showArrow ? `url(#${markerType})` : undefined}
          />
        );
      })}
    </svg>
  );
};
