import React, { useState, useEffect, useRef } from 'react';
import type { LogEntry, LogCategory } from '../../../../types';
import styles from './Logger.module.css';

interface LoggerProps {
  entries: LogEntry[];
  onClear: () => void;
}

export const Logger: React.FC<LoggerProps> = ({ entries, onClear }) => {
  const [isDetailed, setIsDetailed] = useState(false);
  const [filter, setFilter] = useState<'all' | LogCategory>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logContentRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef(0);

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.category === filter;
  });

  // Auto-scroll to bottom when new entries are added (only if auto-scroll is enabled)
  useEffect(() => {
    if (autoScroll && logContentRef.current && !isUserScrollingRef.current) {
      const scrollElement = logContentRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [filteredEntries, autoScroll]);
  // Improved scroll handling with debouncing and better user intent detection
  const handleScroll = () => {
    if (!logContentRef.current) return;

    const scrollElement = logContentRef.current;
    const currentScrollTop = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;
    const isAtBottom = scrollHeight - currentScrollTop <= clientHeight + 5;

    // Detect if user is actively scrolling up
    const isScrollingUp = currentScrollTop < lastScrollTopRef.current;
    lastScrollTopRef.current = currentScrollTop;

    // If user scrolls up from any position, disable auto-scroll immediately
    if (isScrollingUp && !isUserScrollingRef.current) {
      isUserScrollingRef.current = true;
      setAutoScroll(false);
    }

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a timeout to check if user has stopped scrolling
    scrollTimeoutRef.current = window.setTimeout(() => {
      // If user is at bottom and hasn't scrolled for a while, re-enable auto-scroll
      if (isAtBottom) {
        setAutoScroll(true);
        isUserScrollingRef.current = false;
      }
    }, 150); // 150ms delay to detect when user stops scrolling
  };

  // Handle wheel events to immediately detect user intent to scroll up
  const handleWheel = (e: React.WheelEvent) => {
    // If user scrolls up (negative deltaY) and we're at the bottom, disable auto-scroll immediately
    if (e.deltaY < 0 && autoScroll && logContentRef.current) {
      const scrollElement = logContentRef.current;
      const isAtBottom = scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight + 5;

      if (isAtBottom) {
        isUserScrollingRef.current = true;
        setAutoScroll(false);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Reset user scrolling flag after entries change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (logContentRef.current) {
        const scrollElement = logContentRef.current;
        const isAtBottom = scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight + 5;
        if (isAtBottom) {
          isUserScrollingRef.current = false;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredEntries]);

  const formatLogMessage = (entry: LogEntry) => {
    if (!isDetailed || !entry.details) {
      return entry.message;
    }

    // Format detailed technical information
    const details = entry.details;
    let formattedMessage = entry.message;

    if (details.packetInfo) {
      const { packetInfo } = details;
      formattedMessage += `\n  └─ Packet: ${packetInfo.protocol} | ${packetInfo.source} → ${packetInfo.destination}`;

      if (packetInfo.size) {
        formattedMessage += ` | Size: ${packetInfo.size}`;
      }

      if (packetInfo.ttl !== undefined) {
        formattedMessage += ` | TTL: ${packetInfo.ttl}`;
      }

      if (packetInfo.query) {
        formattedMessage += `\n  └─ Payload: ${packetInfo.query}`;
      }

      if (packetInfo.natPerformed) {
        formattedMessage += `\n  └─ NAT: ${packetInfo.originalSource} → ${packetInfo.translatedSource}`;
      }

      if (packetInfo.routingDecision) {
        formattedMessage += `\n  └─ Route: ${packetInfo.routingDecision}`;
      }

      if (packetInfo.nextHop) {
        formattedMessage += ` via ${packetInfo.nextHop}`;
      }
    }

    if (details.routingInfo) {
      formattedMessage += `\n  └─ Routing Table: ${Object.entries(details.routingInfo).length} entries`;
    }

    if (details.performanceMetrics) {
      const { latency, throughput, packetLoss } = details.performanceMetrics;
      formattedMessage += `\n  └─ Metrics: Latency ${latency}ms | Throughput ${throughput} | Loss ${packetLoss}%`;
    }

    if (details.securityInfo) {
      const { threatLevel, protectionStatus, blockReason } = details.securityInfo;
      formattedMessage += `\n  └─ Security: Threat ${threatLevel} | Status ${protectionStatus}`;
      if (blockReason) {
        formattedMessage += ` | Blocked: ${blockReason}`;
      }
    }

    return formattedMessage;
  };

  const getLogIcon = (entry: LogEntry) => {
    if (entry.category === 'packet') return '📦';
    if (entry.category === 'routing') return '🛤️';
    if (entry.category === 'security') return '🛡️';
    if (entry.category === 'system') return '⚙️';

    switch (entry.type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };
  return (
    <div className={styles.logContainer}>
      <div className={styles.logHeader}>
        <h3>
          <i className="fas fa-list"></i>
          Network Activity Log
        </h3>
        <div className={styles.logControls}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | LogCategory)}
            className={styles.logFilter}
            title="Filter log entries"
          >
            <option value="all">All Logs</option>
            <option value="packet">Packets</option>
            <option value="routing">Routing</option>
            <option value="security">Security</option>
            <option value="system">System</option>
          </select>
          <button
            className={`${styles.detailToggle} ${isDetailed ? styles.active : ''}`}
            onClick={() => setIsDetailed(!isDetailed)}
            title="Toggle detailed view"
          >
            <i className="fas fa-microscope"></i>
          </button>
          <button
            className={`${styles.autoScrollToggle} ${autoScroll ? styles.active : ''}`}
            onClick={() => {
              const newAutoScroll = !autoScroll;
              setAutoScroll(newAutoScroll);
              if (newAutoScroll && logContentRef.current) {
                isUserScrollingRef.current = false;
                logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
              }
            }}
            title={autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"}
          >
            <i className="fas fa-arrow-down"></i>
          </button>

          <button className={styles.clearLogBtn} onClick={onClear} title="Clear Log">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div
        className={styles.logContent}
        ref={logContentRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        {filteredEntries.map((entry, index) => (
          <div key={index} className={`${styles.logEntry} ${styles[entry.type]} ${entry.category ? styles[entry.category] : ''}`}>
            <div className={styles.logEntryHeader}>
              <span className={styles.logIcon}>{getLogIcon(entry)}</span>
              <span className={styles.timestamp}>{entry.timestamp}</span>
              {entry.category && (
                <span className={`${styles.categoryBadge} ${styles[entry.category]}`}>
                  {entry.category.toUpperCase()}
                </span>
              )}
            </div>
            <div className={styles.logMessage}>
              <pre>{formatLogMessage(entry)}</pre>
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className={`${styles.logEntry} ${styles.info}`}>
            <div className={styles.logMessage}>
              No {filter !== 'all' ? filter : ''} logs to display
            </div>
          </div>
        )}
      </div>

      <div className={styles.logFooter}>
        <div className={styles.logStatus}>
          <small>
            {filteredEntries.length} of {entries.length} entries
            {isDetailed && ' (detailed view)'}
          </small>
          {!autoScroll && (
            <button
              className={styles.scrollToBottomBtn}
              onClick={() => {
                setAutoScroll(true);
                isUserScrollingRef.current = false;
                if (logContentRef.current) {
                  logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
                }
              }}
              title="Scroll to bottom and enable auto-scroll"
            >
              <i className="fas fa-chevron-down"></i> Latest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
