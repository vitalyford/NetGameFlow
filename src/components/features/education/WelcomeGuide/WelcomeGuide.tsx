import React, { useState } from 'react';
import { getNetworkExplanation } from '@/utils/networkExplanations';
import styles from './WelcomeGuide.module.css';
import techTermStyles from '@/components/ui/TechTerm/TechTerm.module.css';

interface WelcomeGuideProps {
  isVisible: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

interface MiniPopup {
  title: string;
  content: string;
}

// Custom TechTerm component for welcome guide that shows mini popups
const WelcomeTechTerm: React.FC<{ term: string; children: React.ReactNode; onShowPopup: (popup: MiniPopup) => void }> = ({ term, children, onShowPopup }) => {
  const explanation = getNetworkExplanation(term);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (explanation) {
      onShowPopup({
        title: explanation.title,
        content: explanation.content
      });
    }
  };

  // If no explanation exists, just render the children without interaction
  if (!explanation) {
    return <>{children}</>;
  }  return (
    <span
      className={`${techTermStyles.term} ${techTermStyles.clickable}`}
      onClick={handleClick}
      title={`Click to learn more about ${term}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          if (explanation) {
            onShowPopup({
              title: explanation.title,
              content: explanation.content
            });
          }
        }
      }}
    >
      {children}
    </span>
  );
};

interface WelcomeGuideProps {
  isVisible: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({
  isVisible,
  onClose,
  onStartTour
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [miniPopup, setMiniPopup] = useState<MiniPopup | null>(null);

  const showMiniPopup = (popup: MiniPopup) => {
    setMiniPopup(popup);
  };

  const hideMiniPopup = () => {
    setMiniPopup(null);
  };

  const steps = [
    {
      title: "Welcome to NetworkFlow! 🌐",
      content: (        <div>
          <p>Learn how the internet works through an interactive, step-by-step simulation!</p>
          <p>This educational platform shows you exactly how data travels from your computer to websites and back through <strong>35+ detailed steps</strong>.</p>
          <div className={styles.featureHighlight}>
            <h4>What you'll discover:</h4>
            <ul>
              <li>DNS Resolution - How your computer finds websites</li>
              <li>HTTPS Requests - How secure connections work</li>
              <li>CDN Delivery - Why some websites load faster</li>
              <li>DDoS Attacks - How cyber attacks work and protection methods</li>
              <li>Technical Details - Real IP addresses, protocols, and routing</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Complete Internet Journey 🚀",
      content: (        <div>
          <div className={styles.journeyOverview}>
            <h4>One Complete Demonstration</h4>
            <p>Watch a <strong>complete internet flow</strong> from start to finish:</p>
            <ol className={styles.journeySteps}>
              <li><strong>🔍 DNS Resolution</strong> - Find the website's IP address</li>
              <li><strong>📡 HTTPS Request</strong> - Send a secure web request</li>
              <li><strong>📄 Web Content</strong> - Receive the main webpage</li>
              <li><strong>⚡ CDN Resources</strong> - Fetch images and files from fast servers</li>
              <li><strong>🛡️ DDoS & Protection</strong> - See how attacks work and are stopped</li>
            </ol>
          </div>
          <p className={styles.journeyNote}>
            <strong>💡 Perfect for:</strong> Students, teachers, and anyone curious about how the internet really works!
          </p>
        </div>
      )
    }, {
      title: "Understanding the Network 🗺️",
      content: (        <div>
          <p>You'll see different devices that help move data across the internet:</p>
          <div className={styles.deviceGrid}>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>💻</span>
              <div>
                <strong>Your Computer</strong>
                <p>Where requests start (192.168.1.100)</p>
              </div>
            </div>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>📡</span>
              <div>
                <strong><WelcomeTechTerm term="Router" onShowPopup={showMiniPopup}>Home Router</WelcomeTechTerm></strong>
                <p>NAT translation & ISP connection</p>
              </div>
            </div>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>📚</span>
              <div>
                <strong><WelcomeTechTerm term="DNS" onShowPopup={showMiniPopup}>DNS Server</WelcomeTechTerm></strong>
                <p>Google's 8.8.8.8 address book</p>
              </div>
            </div>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>🏢</span>
              <div>
                <strong><WelcomeTechTerm term="Server" onShowPopup={showMiniPopup}>Web Server</WelcomeTechTerm></strong>
                <p>Hosts websites & content</p>
              </div>
            </div>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>⚡</span>
              <div>
                <strong>CDN Server</strong>
                <p>Fast content delivery</p>
              </div>
            </div>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>🛡️</span>
              <div>
                <strong>DDoS Protection</strong>
                <p>Cloudflare security</p>
              </div>
            </div>
          </div>
          <p className={styles.interactionTip}>
            <strong>🎯 Try this:</strong> Click on any device during the simulation to learn more about it!
          </p>
        </div>
      )
    },
    {
      title: "Interactive Learning Features ✨",
      content: (        <div>
          <div className={styles.featuresList}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⏯️</span>
              <div>
                <strong>Step-by-Step Control</strong>
                <p>Pause, go back, or jump ahead through 35+ detailed steps at your own pace</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏷️</span>
              <div>
                <strong>Smart Tooltips</strong>
                <p>Click technical terms for simple explanations and real-world analogies</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🖱️</span>
              <div>
                <strong>Draggable Network</strong>
                <p>Move devices around to explore the network layout - connections follow!</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📊</span>
              <div>
                <strong>Real-time Activity Log</strong>
                <p>Track network events, see real IP addresses, protocols, and packet details</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🧩</span>
              <div>
                <strong>Flexible Interface</strong>
                <p>Resize panels, toggle views, use keyboard shortcuts (Ctrl+1, Ctrl+2)</p>
              </div>
            </div>
          </div>
          <p className={styles.gettingStartedTip}>
            <strong>🚀 Ready to start?</strong> Click "Start" in the control panel to begin your journey through the internet!
          </p>
        </div>
      )
    }
  ];

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;  return (
    <div className={styles.welcomeOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.welcomeGuide}>
        <div className={styles.welcomeHeader}>
          <h2>{steps[currentStep].title}</h2>
          <button className={styles.welcomeClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.welcomeContent}>
          {steps[currentStep].content}
        </div>

        <div className={styles.welcomeFooter}>
          <div className={styles.stepIndicators}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.stepDot} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''}`}
              />
            ))}
          </div>

          <div className={styles.welcomeActions}>
            <button
              className={`${styles.welcomeBtn} ${styles.secondary}`}
              onClick={onClose}
            >
              Skip Tour
            </button>

            {currentStep > 0 && (
              <button
                className={`${styles.welcomeBtn} ${styles.outline}`}
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}

            <button
              className={`${styles.welcomeBtn} ${styles.primary}`}
              onClick={handleNext}
            >
              {isLastStep ? "Let's Start!" : "Next"}
            </button>
          </div>
        </div>

        {/* Mini popup for tech terms */}
        {miniPopup && (
          <div className={styles.welcomeMiniPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.miniPopupContent}>
              <div className={styles.miniPopupHeader}>
                <h4>{miniPopup.title}</h4>
                <button className={styles.miniPopupClose} onClick={hideMiniPopup}>×</button>
              </div>
              <div
                className={styles.miniPopupBody}
                dangerouslySetInnerHTML={{ __html: miniPopup.content }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
