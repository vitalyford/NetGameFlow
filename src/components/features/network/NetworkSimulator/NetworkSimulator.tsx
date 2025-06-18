import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Device } from '../Device/Device';
import { Connection } from '../Connection/Connection';
import { StepController } from '../../controls/StepController/StepController';
import { Logger } from '../../logging/Logger/Logger';
import { ControlPanel } from '../../controls/ControlPanel/ControlPanel';
import { EducationalPopup } from '../../education/EducationalPopup/EducationalPopup';
import { WelcomeGuide } from '../../education/WelcomeGuide/WelcomeGuide';
import { EducationalProvider } from '@/contexts/EducationalContext';
import { useEducational } from '@/hooks/useEducational';
import { useNetworkSimulator } from '@/hooks/useNetworkSimulator';
import type { NetworkSimulatorProps } from '@/types';
import styles from './NetworkSimulator.module.css';

export const NetworkSimulator: React.FC<NetworkSimulatorProps> = (props) => {
    return (
        <EducationalProvider>
            <NetworkSimulatorInner {...props} />
        </EducationalProvider>
    );
};

const NetworkSimulatorInner: React.FC<NetworkSimulatorProps> = ({
    className = '',
    onStatsChange,
    onScenarioChange,
    initialScenario = 'basic',
    showControls = true,
    showLogger = true,
    autoStart = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepControllerRef = useRef<HTMLDivElement>(null);
    const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
    const [showEducational, setShowEducational] = useState(false);
    const [educationalContent, setEducationalContent] = useState({ title: '', content: '' });
    const [showWelcome, setShowWelcome] = useState(false); // Never auto-show
    const [hasAccessedTour, setHasAccessedTour] = useState(() => {
        // Check localStorage to see if tour has been accessed before
        return localStorage.getItem('networkflow-tour-accessed') === 'true';
    });

    // Get educational context for tech terms
    const { currentPopup, hidePopup } = useEducational();
    // Panel visibility state
    const [showControlPanel, setShowControlPanel] = useState(true);
    const [showLogPanel, setShowLogPanel] = useState(true);
    const [showPanelDropdown, setShowPanelDropdown] = useState(false);    // Canvas dragging and zoom state
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showDragHint, setShowDragHint] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isZooming, setIsZooming] = useState(false);

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
        previousStep,
        startAutoPlay,
        stopAutoPlay,
        resetSteps,
        stopSimulation,
    } = useNetworkSimulator(initialScenario);
    // Initialize container rect and devices
    useEffect(() => {
        const updateContainerRect = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // Only initialize if we have a meaningful container size
                if (rect.width > 0 && rect.height > 0) {
                    setContainerRect(rect);
                    initializeDevices(rect, false); // Initial setup, don't preserve states
                }
            }
        };

        // Use a small delay to ensure the DOM is fully rendered
        const timer = setTimeout(updateContainerRect, 100);

        return () => clearTimeout(timer);
    }, [initializeDevices]);

    // Handle window resize and re-initialize if needed
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    setContainerRect(rect);
                    // Only re-initialize devices on significant size changes AND preserve states during simulations
                    const significantSizeChange = Math.abs(rect.width - (containerRect?.width || 0)) > 100 ||
                        Math.abs(rect.height - (containerRect?.height || 0)) > 100;

                    if (significantSizeChange) {
                        // Preserve device states if we're in step mode or have active devices
                        const shouldPreserveStates = isStepMode || Object.values(devices).some(device => device.active || device.attackState !== 'normal');
                        initializeDevices(rect, shouldPreserveStates);
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
    }, [containerRect, initializeDevices, isStepMode, devices]);

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
                title: 'Internet Backbone Router A',
                content: `<p>One of millions of routers that form the internet's backbone infrastructure.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Routes data across continents and countries</p>
                 <p>• Handles massive amounts of traffic simultaneously</p>
                 <p>• Finds the fastest path to destinations</p>
                 <p>• Connects different internet service providers</p>
                 <p><em>Think of it as: A major highway interchange</em></p>`,
            },
            internetRouter2: {
                title: 'Internet Backbone Router B',
                content: `<p>Another critical router in the internet's backbone infrastructure, specialized for DNS routing.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Routes DNS queries to name servers</p>
                 <p>• Handles domain name resolution traffic</p>
                 <p>• Provides redundant paths for reliability</p>
                 <p>• Connects to global DNS infrastructure</p>
                 <p><em>Think of it as: A specialized post office that handles address lookups</em></p>`,
            },
            internetRouter3: {
                title: 'Internet Backbone Router C',
                content: `<p>A backbone router focused on web server and content delivery routing.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Routes requests to web servers</p>
                 <p>• Handles content delivery traffic</p>
                 <p>• Manages high-bandwidth data transfers</p>
                 <p>• Optimizes paths to content servers</p>
                 <p><em>Think of it as: An express highway to shopping centers and entertainment venues</em></p>`,
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
            }, cdnServer: {
                title: 'CDN Server (Content Delivery Network)',
                content: `<p>A copy of popular websites stored closer to you for faster loading.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Stores copies of websites around the world</p>
                 <p>• Serves content from the closest location</p>
                 <p>• Makes websites load much faster</p>
                 <p>• Reduces load on the main web server</p>
                 <p><em>Think of it as: Local bookstores that stock popular books so you don't have to go to the main publisher</em></p>`,
            },
            botnetCloud: {
                title: 'Botnet Army (Cybersecurity Threat)',
                content: `<p>⚠️ A network of infected computers controlled by cybercriminals.</p>
                 <p><strong>What it is:</strong></p>
                 <p>• Thousands of hacked computers working together</p>
                 <p>• Controlled remotely by criminals (called "bot herders")</p>
                 <p>• Used for launching coordinated cyber attacks</p>
                 <p>• Often the computers' owners don't even know they're infected</p>
                 <p><strong>Common attacks:</strong></p>
                 <p>• DDoS attacks (overwhelming websites with traffic)</p>
                 <p>• Spreading malware and viruses</p>
                 <p>• Cryptocurrency mining theft</p>
                 <p>• Spam email campaigns</p>
                 <p><em>Think of it as: A zombie army of computers doing the criminal's bidding</em></p>
                 <p><strong>🛡️ Protection:</strong> Keep your software updated, use antivirus, and avoid clicking suspicious links!</p>`,
            },
            cloudflareEdge: {
                title: 'Cloudflare Edge Protection',
                content: `<p>🛡️ A protective shield that sits between you and websites to keep both safe.</p>
                 <p><strong>What it does:</strong></p>
                 <p>• Blocks malicious traffic and cyber attacks</p>
                 <p>• Speeds up websites by caching content globally</p>
                 <p>• Protects against DDoS attacks</p>
                 <p>• Filters out bots and suspicious requests</p>
                 <p><strong>Security features:</strong></p>
                 <p>• Web Application Firewall (WAF)</p>
                 <p>• Bot protection and challenge pages</p>
                 <p>• SSL/TLS encryption</p>
                 <p>• Rate limiting to prevent abuse</p>
                 <p><strong>Performance benefits:</strong></p>
                 <p>• Global CDN with 300+ data centers</p>
                 <p>• Faster DNS resolution (1.1.1.1)</p>
                 <p>• Image and code optimization</p>
                 <p><em>Think of it as: A super-smart security guard and speed booster for websites</em></p>`,
            },
        };

        return deviceInfoData[deviceId] || null;
    };

    const currentStepData = stepData[currentStep];
    const currentStepConnection = currentStepData ?
        `${currentStepData.fromDevice}-${currentStepData.toDevice}` : undefined;
    const handleWelcomeClose = () => {
        setShowWelcome(false);
    };
    const handleStartTour = () => {
        setShowWelcome(false);
        // First, completely reset any existing simulation state
        stopSimulation();
        // Start with the basic scenario and packet simulation
        changeScenario('basic');
        setTimeout(() => startStepMode('packet'), 500);
    };
    const handleShowTour = () => {
        setShowWelcome(true);
        // Mark tour as accessed and save to localStorage
        if (!hasAccessedTour) {
            setHasAccessedTour(true);
            localStorage.setItem('networkflow-tour-accessed', 'true');
        }
    };
    // Keyboard shortcuts for panel toggles and dropdown management
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

        const handleClickOutside = (e: MouseEvent) => {
            // Close panel dropdown when clicking outside
            if (showPanelDropdown &&
                !document.querySelector(`.${styles.panelManager}`)?.contains(e.target as Node)) {
                setShowPanelDropdown(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showControlPanel, showLogPanel, showPanelDropdown]);    // Constrain canvas offset to reasonable bounds based on zoom level
    const constrainOffset = useCallback((offset: { x: number; y: number }) => {
        // Adjust max offset based on zoom level - allow more movement when zoomed in
        const baseMaxOffset = 500;
        const maxOffset = baseMaxOffset * Math.max(1, zoomLevel);
        
        const constrainedOffset = {
            x: Math.max(-maxOffset, Math.min(maxOffset, offset.x)),
            y: Math.max(-maxOffset, Math.min(maxOffset, offset.y))
        };

        // Add visual feedback when at boundaries
        const isAtBoundary = constrainedOffset.x !== offset.x || constrainedOffset.y !== offset.y;
        if (containerRef.current) {
            if (isAtBoundary) {
                containerRef.current.classList.add(styles.atBoundary);
                // Remove the class after a short delay
                setTimeout(() => {
                    containerRef.current?.classList.remove(styles.atBoundary);
                }, 200);
            }
        }

        return constrainedOffset;
    }, [zoomLevel]);

    // Zoom handling functions
    const handleZoomChange = useCallback((newZoom: number, centerX?: number, centerY?: number) => {
        const minZoom = 0.1;
        const maxZoom = 3;
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        
        if (clampedZoom === zoomLevel) return;

        // If center point is provided, adjust offset to zoom towards that point
        if (centerX !== undefined && centerY !== undefined && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const relativeX = centerX - rect.left;
            const relativeY = centerY - rect.top;
            
            // Calculate the point in the canvas coordinate system
            const canvasPointX = (relativeX - canvasOffset.x) / zoomLevel;
            const canvasPointY = (relativeY - canvasOffset.y) / zoomLevel;
            
            // Calculate new offset to keep the zoom center point fixed
            const newOffsetX = relativeX - canvasPointX * clampedZoom;
            const newOffsetY = relativeY - canvasPointY * clampedZoom;
            
            setCanvasOffset(constrainOffset({ x: newOffsetX, y: newOffsetY }));
        }
        
        setZoomLevel(clampedZoom);
    }, [zoomLevel, canvasOffset, constrainOffset]);

    // Mouse wheel zoom
    const handleWheel = useCallback((e: WheelEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) return;
        
        // Check if user is holding Ctrl key for zoom, otherwise allow normal scrolling
        if (!e.ctrlKey && !e.metaKey) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = zoomLevel * zoomDelta;
        
        handleZoomChange(newZoom, e.clientX, e.clientY);
    }, [zoomLevel, handleZoomChange]);    // Touch pinch-to-zoom
    const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
    const [touchStartZoom, setTouchStartZoom] = useState<number>(1);

    const getTouchDistance = useCallback((touches: React.TouchList) => {
        if (touches.length < 2) return null;
        const touch1 = touches[0];
        const touch2 = touches[1];
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) + 
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }, []);// Touch handlers for mobile support
    const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('[data-device-id], .step-controller, .floating-step-details-button')) {
            return;
        }

        if (e.touches.length === 1) {
            // Single touch - panning
            e.preventDefault();
            const touch = e.touches[0];
            setIsDragging(true);
            setShowDragHint(false);
            setDragStart({
                x: touch.clientX - canvasOffset.x,
                y: touch.clientY - canvasOffset.y
            });
        } else if (e.touches.length === 2) {
            // Two touches - pinch to zoom
            e.preventDefault();
            setIsDragging(false);
            setIsZooming(true);
            const distance = getTouchDistance(e.touches);
            setTouchStartDistance(distance);
            setTouchStartZoom(zoomLevel);
        }
    }, [canvasOffset, zoomLevel, getTouchDistance]);

    const handleCanvasTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        
        if (e.touches.length === 1 && isDragging && !isZooming) {
            // Single touch panning
            const touch = e.touches[0];
            const newOffset = constrainOffset({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
            setCanvasOffset(newOffset);
        } else if (e.touches.length === 2 && isZooming && touchStartDistance) {
            // Two finger pinch to zoom
            const currentDistance = getTouchDistance(e.touches);
            if (currentDistance) {
                const zoomFactor = currentDistance / touchStartDistance;
                const newZoom = touchStartZoom * zoomFactor;
                
                // Get center point between the two touches
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                
                handleZoomChange(newZoom, centerX, centerY);
            }
        }
    }, [isDragging, isZooming, dragStart, constrainOffset, touchStartDistance, touchStartZoom, getTouchDistance, handleZoomChange]);

    const handleCanvasTouchEnd = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
        }
        if (isZooming) {
            setIsZooming(false);
            setTouchStartDistance(null);
        }
    }, [isDragging, isZooming]);    // Global mouse event handlers to handle dragging and canvas interactions
    useEffect(() => {
        const handleGlobalMouseDown = (e: MouseEvent) => {
            // Check if the click is within our container
            if (!containerRef.current?.contains(e.target as Node)) {
                return;
            }

            // Don't handle if clicking on devices or other interactive elements
            const target = e.target as HTMLElement;
            if (target.closest('[data-device-id], .step-tooltip, .step-controller, .floating-step-details-button, .step-controls, button, .resize-handle, .tech-term')) {
                return; // Let the device handle its own events
            }

            // Only handle if clicking on the canvas container itself or canvas background elements
            if (target === containerRef.current || target.classList.contains('canvasDragHint') ||
                target.closest(`.${styles.networkTopology}`) || target.tagName === 'svg' || target.tagName === 'path') {

                e.preventDefault();
                setIsDragging(true);
                setShowDragHint(false);
                setDragStart({
                    x: e.clientX - canvasOffset.x,
                    y: e.clientY - canvasOffset.y
                });
            }
        };

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            e.preventDefault();
            const newOffset = constrainOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
            setCanvasOffset(newOffset);
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        document.addEventListener('mousedown', handleGlobalMouseDown);
        document.addEventListener('wheel', handleWheel, { passive: false });
        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousedown', handleGlobalMouseDown);
            document.removeEventListener('wheel', handleWheel);
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, canvasOffset, constrainOffset, handleWheel]);    // Reset canvas position and zoom
    const resetCanvasPosition = useCallback(() => {
        setCanvasOffset({ x: 0, y: 0 });
        setZoomLevel(1);
        // Temporarily add a smooth transition class
        if (containerRef.current) {
            containerRef.current.classList.add(styles.resettingPosition);
            setTimeout(() => {
                containerRef.current?.classList.remove(styles.resettingPosition);
            }, 300);
        }
    }, []);

    // Add keyboard shortcut for resetting canvas position
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            // Reset canvas position with 'R' key
            if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                resetCanvasPosition();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [resetCanvasPosition]);

    return (
        <div className={`${styles.networkSimulator} ${className}`}>
            {/* Header */}
            <header className={styles.networkHeader}>
                <div className={styles.headerContent}>                    <div className={styles.headerTitle}>
                        <div className={styles.brand}>
                            <div className={styles.brandIcon}>
                                <i className="fas fa-network-wired"></i>
                            </div>
                            <div className={styles.brandText}>
                                <h1>NetworkFlow</h1>
                                <span className={styles.tagline}>Interactive Network Learning</span>
                            </div>
                        </div>
                    </div>
                      {/* Zoom Controls in Header */}
                    <div className={styles.headerZoomControls}>
                        <div className={styles.zoomButtonsRow}>
                            <button
                                className={styles.headerZoomBtn}
                                onClick={() => handleZoomChange(zoomLevel * 0.8)}
                                title="Zoom out (Ctrl + Mouse Wheel)"
                            >
                                <i className="fas fa-minus"></i>
                            </button>
                            <div className={styles.headerZoomLevel} title={`Current zoom: ${Math.round(zoomLevel * 100)}%`}>
                                {Math.round(zoomLevel * 100)}%
                            </div>
                            <button
                                className={styles.headerZoomBtn}
                                onClick={() => handleZoomChange(zoomLevel * 1.2)}
                                title="Zoom in (Ctrl + Mouse Wheel)"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                        <div className={styles.zoomHint}>
                            CTRL + Mouse Wheel
                        </div>
                    </div>

                    <div className={styles.headerControls}>
                        {/* Canvas Reset Button - only show when canvas is moved or zoomed */}
                        {(canvasOffset.x !== 0 || canvasOffset.y !== 0 || zoomLevel !== 1) && (
                            <button
                                className={`${styles.toggleBtn} ${styles.resetCanvasBtn}`}
                                onClick={resetCanvasPosition}
                                title="Reset canvas position and zoom (R)"
                            >
                                <i className="fas fa-home"></i>
                                <span>Reset View</span>
                            </button>
                        )}
                        {/* Tour Button */}
                        <button
                            className={`${styles.toggleBtn} ${styles.tourHeaderBtn} ${!hasAccessedTour ? styles.tourNew : ''}`}
                            onClick={handleShowTour}
                            title="Take an interactive tour to learn how the platform works"
                        >
                            <i className="fas fa-question-circle"></i>
                            <span>Tour</span>
                        </button>
                        {/* Panel Manager Dropdown */}
                        <div className={styles.panelManager}>
                            <button
                                className={styles.panelManagerBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPanelDropdown(!showPanelDropdown);
                                }}
                                title="Manage panels"
                            >
                                <i className="fas fa-layout"></i>
                                <span>Panels</span>
                                <i className="fas fa-chevron-down"></i>
                            </button>
                            <div className={`${styles.panelDropdown} ${showPanelDropdown ? styles.show : ''}`}>
                                <div className={styles.panelOption}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showControlPanel}
                                            onChange={() => setShowControlPanel(!showControlPanel)}
                                        />
                                        <span className={styles.checkmark}></span>
                                        <div className={styles.optionContent}>
                                            <i className="fas fa-sliders-h"></i>
                                            <div>
                                                <span className={styles.optionTitle}>Control Panel</span>
                                                <span className={styles.optionDesc}>Simulation controls & scenarios</span>
                                            </div>
                                        </div>
                                    </label>
                                    <kbd>Ctrl+1</kbd>
                                </div>
                                <div className={styles.panelOption}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showLogPanel}
                                            onChange={() => setShowLogPanel(!showLogPanel)}
                                        />
                                        <span className={styles.checkmark}></span>
                                        <div className={styles.optionContent}>
                                            <i className="fas fa-list"></i>
                                            <div>
                                                <span className={styles.optionTitle}>Activity Log</span>
                                                <span className={styles.optionDesc}>Network traffic & events</span>
                                            </div>
                                        </div>
                                    </label>
                                    <kbd>Ctrl+2</kbd>
                                </div>
                                <hr />
                                <div className={styles.panelPresets}>
                                    <span className={styles.presetLabel}>Quick Layouts:</span>
                                    <button
                                        className={styles.presetBtn} onClick={() => {
                                            setShowControlPanel(true);
                                            setShowLogPanel(true);
                                            // Close dropdown
                                            setShowPanelDropdown(false);
                                        }}
                                        title="Show all panels"
                                    >
                                        <i className="fas fa-th"></i>
                                        All
                                    </button>
                                    <button
                                        className={styles.presetBtn} onClick={() => {
                                            setShowControlPanel(false);
                                            setShowLogPanel(false);
                                            // Close dropdown
                                            setShowPanelDropdown(false);
                                        }}
                                        title="Hide all panels for focused view"
                                    >
                                        <i className="fas fa-expand"></i>
                                        Focus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className={`${styles.networkLayout} ${!showControlPanel ? styles.noControlPanel : ''} ${!showLogPanel ? styles.noLogPanel : ''}`}>
                {/* Control Panel */}
                {showControls && (
                    <div className={`${styles.controlPanelContainer} ${showControlPanel ? styles.expanded : styles.collapsed}`}>
                        <button
                            className={`${styles.panelCollapseBtn} ${styles.controlPanelCollapse}`}
                            onClick={() => setShowControlPanel(!showControlPanel)}
                            title={showControlPanel ? "Collapse control panel" : "Expand control panel"}
                        >
                            <i className={`fas ${showControlPanel ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                        </button>
                        {showControlPanel && (
                            <ControlPanel
                                onStartPacketSimulation={() => startStepMode('packet')}
                                onStartMessageSimulation={() => startStepMode('message')}
                                onStopSimulation={stopSimulation}
                                isStepMode={isStepMode}
                                currentStep={currentStep}
                                totalSteps={stepData.length}
                            />
                        )}
                    </div>)}
                {/* Network Topology */}
                <div className={styles.networkContainer}>
                    {/* Show Control Panel Button - appears when control panel is hidden */}
                    {showControls && !showControlPanel && (
                        <button
                            className={`${styles.showPanelBtn} ${styles.showControlPanelBtn}`}
                            onClick={() => setShowControlPanel(true)}
                            title="Show control panel"
                        >
                            <i className="fas fa-sliders-h"></i>
                        </button>
                    )}                    {/* Show Log Panel Button - appears when log panel is hidden */}
                    {showLogger && !showLogPanel && (
                        <button
                            className={`${styles.showPanelBtn} ${styles.showLogPanelBtn}`}
                            onClick={() => setShowLogPanel(true)}
                            title="Show activity log"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    )}<div
                        className={`${styles.networkTopology} ${isDragging ? styles.dragging : ''}`}
                        ref={containerRef}
                        onTouchStart={handleCanvasTouchStart}
                        onTouchMove={handleCanvasTouchMove}
                        onTouchEnd={handleCanvasTouchEnd}
                        style={{
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoomLevel})`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    >                        {/* Canvas Drag Hint */}
                        {showDragHint && canvasOffset.x === 0 && canvasOffset.y === 0 && zoomLevel === 1 && !isDragging && (
                            <div className={styles.canvasDragHint}>
                                <i className="fas fa-hand-paper"></i>
                                &nbsp;Drag to pan • Ctrl+Wheel to zoom • R to reset
                            </div>
                        )}{/* Devices */}
                        {containerRect && Object.values(devices).map((device) => (
                            <Device
                                key={device.id}
                                device={device}
                                onDeviceMove={handleDeviceMove}
                                onDeviceClick={handleDeviceClick}
                                containerRect={containerRect}
                                canvasOffset={canvasOffset}
                            />
                        ))}

                        {/* Connections */}
                        <Connection
                            connections={connections}
                            devices={devices}
                            activeConnections={activeConnections}
                            currentStepConnection={currentStepConnection}
                        />
                        {/* Connections */}
                        <Connection
                            connections={connections}
                            devices={devices}
                            activeConnections={activeConnections}
                            currentStepConnection={currentStepConnection} />
                        {/* Step Details Button - only shown during step mode */}
                        {isStepMode && (
                            <button
                                className={styles.floatingStepDetailsButton}
                                onClick={() => {
                                    // Force show the step controller by scrolling to it and expanding if minimized
                                    if (stepControllerRef.current) {
                                        stepControllerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        // If it's minimized, click the minimize button to expand it
                                        const minimizeBtn = stepControllerRef.current.querySelector('button[title*="Expand"]') as HTMLButtonElement;
                                        if (minimizeBtn) {
                                            minimizeBtn.click();
                                        }
                                    }
                                }}
                                title="Show current step details"
                                aria-label="Show current step details"
                            >
                                📋
                            </button>
                        )}
                        {/* Step Controller Overlay */}
                        {isStepMode && currentStepData && (
                            <StepController
                                ref={stepControllerRef}
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
                </div>
                {/* Activity Logger */}
                {showLogger && (
                    <div className={`${styles.logPanelContainer} ${showLogPanel ? styles.expanded : styles.collapsed}`}>
                        <button
                            className={`${styles.panelCollapseBtn} ${styles.logPanelCollapse}`}
                            onClick={() => setShowLogPanel(!showLogPanel)}
                            title={showLogPanel ? "Collapse activity log" : "Expand activity log"}
                        >
                            <i className={`fas ${showLogPanel ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                        </button>
                        {showLogPanel && (
                            <Logger
                                entries={logEntries}
                                onClear={clearLog}
                            />
                        )}
                    </div>
                )}
            </div>
            {/* Educational Popup */}
            <EducationalPopup
                popup={(showEducational && educationalContent.title) ? {
                    id: 'device-info',
                    title: educationalContent.title,
                    content: educationalContent.content
                } : currentPopup}
                onClose={() => {
                    if (showEducational) {
                        setShowEducational(false);
                    } else {
                        hidePopup();
                    }
                }}
            />
            {/* Welcome Guide */}
            <WelcomeGuide
                isVisible={showWelcome}
                onClose={handleWelcomeClose}
                onStartTour={handleStartTour}
            />
        </div>
    );
};
