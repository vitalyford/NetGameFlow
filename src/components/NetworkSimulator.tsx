import React, { useRef, useEffect, useState } from 'react';
import { Device } from './Device.tsx';
import { Connection } from './Connection.tsx';
import { StepController } from './StepController.tsx';
import { Logger } from './Logger.tsx';
import { ControlPanel } from './ControlPanel.tsx';
import { EducationalPopup } from './EducationalPopup.tsx';
import { WelcomeGuide } from './WelcomeGuide.tsx';
import { useNetworkSimulator } from '../hooks/useNetworkSimulator';
import type { NetworkSimulatorProps } from '../types';
import './NetworkSimulator.css';

export const NetworkSimulator: React.FC<NetworkSimulatorProps> = ({
  className = '',
  onStatsChange,
  onScenarioChange,
  initialScenario = 'basic',
  showControls = true,
  showLogger = true,
  autoStart = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [showEducational, setShowEducational] = useState(false);
  const [educationalContent, setEducationalContent] = useState({ title: '', content: '' });
  const [showWelcome, setShowWelcome] = useState(!autoStart);
  const [hasStartedTour, setHasStartedTour] = useState(autoStart);
  
  // Panel visibility state
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [showLogPanel, setShowLogPanel] = useState(true);

  const {
    devices,
    currentScenario,
    stats,
    isStepMode,
    currentStep,
    stepData,
    activeConnections,
    logEntries,
    connections,
    initializeDevices,
    handleDeviceMove,
    clearLog,
    changeScenario,
    startStepMode,
    nextStep,
    previousStep,    startAutoPlay,
    stopAutoPlay,
    resetSteps,
  } = useNetworkSimulator(initialScenario);// Initialize container rect and devices
  useEffect(() => {
    const updateContainerRect = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Only initialize if we have a meaningful container size
        if (rect.width > 0 && rect.height > 0) {
          setContainerRect(rect);
          initializeDevices(rect);
        }
      }
    };

    // Use a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(updateContainerRect, 100);
    
    return () => clearTimeout(timer);
  }, [initializeDevices]);  // Handle window resize and re-initialize if needed
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerRect(rect);
          // Re-initialize devices on significant size changes
          if (Math.abs(rect.width - (containerRect?.width || 0)) > 100 || 
              Math.abs(rect.height - (containerRect?.height || 0)) > 100) {
            initializeDevices(rect);
          }
        }
      }
    };

    // Also add a mutation observer to detect when the container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [containerRect, initializeDevices]);

  // Notify parent of stats changes
  useEffect(() => {
    onStatsChange?.(stats);
  }, [stats, onStatsChange]);

  // Notify parent of scenario changes
  useEffect(() => {
    onScenarioChange?.(currentScenario);
  }, [currentScenario, onScenarioChange]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && Object.keys(devices).length > 0) {
      setTimeout(() => startStepMode('packet'), 1000);
    }
  }, [autoStart, devices, startStepMode]);

  const handleDeviceClick = (deviceId: string) => {
    const deviceInfo = getDeviceInfo(deviceId);
    if (deviceInfo) {
      setEducationalContent(deviceInfo);
      setShowEducational(true);
    }
  };
  const getDeviceInfo = (deviceId: string) => {
    const deviceInfoData: Record<string, { title: string; content: string }> = {
      client: {
        title: 'Your Computer (Client)',
        content: `<p>This is your computer - the <strong>client</strong> that starts internet requests.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Sends requests for websites, videos, and files</p>
                 <p>• Receives and displays the responses</p>
                 <p>• Has a private IP address (like 192.168.1.100)</p>
                 <p>• Connected to your home router</p>
                 <p><em>Think of it as: You asking a librarian for a specific book</em></p>`,
      },
      router1: {
        title: 'Home Router',
        content: `<p>Your home router is like a smart traffic director for your internet.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Connects all your home devices to the internet</p>
                 <p>• Provides Wi-Fi and wired connections</p>
                 <p>• Assigns IP addresses to your devices (DHCP)</p>
                 <p>• Acts as a security guard (firewall)</p>
                 <p><em>Think of it as: The mail sorter at your local post office</em></p>`,
      },
      ispRouter: {
        title: 'ISP Router',
        content: `<p>Your Internet Service Provider's router - the gateway to the wider internet.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Connects your home network to the global internet</p>
                 <p>• Manages traffic for your entire neighborhood</p>
                 <p>• Handles high-speed data transmission</p>
                 <p>• Routes data to the correct destinations</p>
                 <p><em>Think of it as: The main highway entrance ramp</em></p>`,
      },
      internetRouter1: {
        title: 'Internet Backbone Router',
        content: `<p>One of millions of routers that form the internet's backbone infrastructure.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Routes data across continents and countries</p>
                 <p>• Handles massive amounts of traffic simultaneously</p>
                 <p>• Finds the fastest path to destinations</p>
                 <p>• Connects different internet service providers</p>
                 <p><em>Think of it as: A major highway interchange</em></p>`,
      },
      dnsServer: {
        title: 'DNS Server (Domain Name System)',
        content: `<p>The internet's address book - translates website names into computer addresses.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Converts "google.com" into "172.217.164.78"</p>
                 <p>• Stores millions of website addresses</p>
                 <p>• Responds to address lookup requests instantly</p>
                 <p>• Updates when websites change addresses</p>
                 <p><em>Think of it as: A phone book that tells you someone's address when you give them the name</em></p>`,
      },
      webServer: {
        title: 'Web Server',
        content: `<p>A powerful computer that stores and serves websites to visitors.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Stores website files (HTML, images, videos)</p>
                 <p>• Processes requests from browsers</p>
                 <p>• Sends back the requested web pages</p>
                 <p>• Handles thousands of visitors simultaneously</p>
                 <p><em>Think of it as: A library that gives you the exact book you ask for</em></p>`,
      },
      cdnServer: {
        title: 'CDN Server (Content Delivery Network)',
        content: `<p>A copy of popular websites stored closer to you for faster loading.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Stores copies of websites around the world</p>
                 <p>• Serves content from the closest location</p>
                 <p>• Makes websites load much faster</p>
                 <p>• Reduces load on the main web server</p>
                 <p><em>Think of it as: Local bookstores that stock popular books so you don't have to go to the main publisher</em></p>`,
      },
    };

    return deviceInfoData[deviceId] || null;
  };

  const currentStepData = stepData[currentStep];
  const currentStepConnection = currentStepData ? 
    `${currentStepData.fromDevice}-${currentStepData.toDevice}` : undefined;
  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setHasStartedTour(true); // Mark as if they've started so help button appears
  };

  const handleStartTour = () => {
    setShowWelcome(false);
    setHasStartedTour(true);
    // Start with the basic scenario and packet simulation
    changeScenario('basic');
    setTimeout(() => startStepMode('packet'), 500);
  };

  // Keyboard shortcuts for panel toggles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setShowControlPanel(!showControlPanel);
            break;
          case '2':
            e.preventDefault();
            setShowLogPanel(!showLogPanel);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showControlPanel, showLogPanel]);

  return (
    <div className={`network-simulator ${className}`}>      {/* Header */}
      <header className="network-header">
        <div className="header-content">
          <div className="header-title">
            <div className="brand">
              <div className="brand-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <div className="brand-text">
                <h1>NetworkFlow</h1>
                <span className="tagline">Interactive Network Learning</span>
              </div>
            </div>
          </div>

          <div className="header-controls">
            {hasStartedTour && (
              <button
                className="help-btn"
                onClick={() => setShowWelcome(true)}
                title="Show welcome guide"
              >
                <i className="fas fa-question-circle"></i>
                <span>Help</span>
              </button>
            )}
            
            {/* Panel toggle buttons */}
            <div className="panel-toggles">
              <button
                className={`toggle-btn ${showControlPanel ? 'active' : ''}`}
                onClick={() => setShowControlPanel(!showControlPanel)}
                title={`${showControlPanel ? "Hide" : "Show"} control panel (Ctrl+1)`}
              >
                <i className="fas fa-sliders-h"></i>
                <span>Controls</span>
              </button>
              
              <button
                className={`toggle-btn ${showLogPanel ? 'active' : ''}`}
                onClick={() => setShowLogPanel(!showLogPanel)}
                title={`${showLogPanel ? "Hide" : "Show"} activity log (Ctrl+2)`}
              >
                <i className="fas fa-list"></i>
                <span>Log</span>              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`network-layout ${!showControlPanel ? 'no-control-panel' : ''} ${!showLogPanel ? 'no-log-panel' : ''}`}>
        {/* Control Panel */}        {showControls && showControlPanel && (
          <ControlPanel
            stats={stats}
            onStartPacketSimulation={() => startStepMode('packet')}
            onStartMessageSimulation={() => startStepMode('message')}
            onClearLog={clearLog}
          />
        )}

        {/* Network Topology */}
        <div className="network-container">
          <div className="network-topology" ref={containerRef}>
            {/* Devices */}
            {containerRect && Object.values(devices).map((device) => (
              <Device
                key={device.id}
                device={device}
                onDeviceMove={handleDeviceMove}
                onDeviceClick={handleDeviceClick}
                containerRect={containerRect}
              />
            ))}            {/* Connections */}
            <Connection
              connections={connections}
              devices={devices}
              activeConnections={activeConnections}
              currentStepConnection={currentStepConnection}
            />{/* Step Controller Overlay */}
            {isStepMode && currentStepData && (
              <StepController
                isStepMode={isStepMode}
                currentStep={currentStep}
                totalSteps={stepData.length}
                stepData={currentStepData}
                onPrevious={previousStep}
                onNext={nextStep}
                onAutoPlay={startAutoPlay}
                onPause={stopAutoPlay}
                onReset={resetSteps}
              />
            )}
          </div>
        </div>        {/* Activity Logger */}
        {showLogger && showLogPanel && (
          <Logger
            entries={logEntries}
            onClear={clearLog}
          />
        )}
      </div>      {/* Educational Popup */}
      <EducationalPopup
        popup={showEducational ? {
          id: 'current',
          title: educationalContent.title,
          content: educationalContent.content
        } : null}
        onClose={() => setShowEducational(false)}
      />
        {/* Welcome Guide */}
      <WelcomeGuide
        isVisible={showWelcome && !hasStartedTour}
        onClose={handleWelcomeClose}
        onStartTour={handleStartTour}
      />
    </div>
  );
};
