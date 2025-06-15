import React, { useState } from 'react';
import { TechTerm } from './TechTerm';
import './TechTerm.css';
import './WelcomeGuide.css';

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

  const steps = [
    {
      title: "Welcome to Network Flow! 🌐",
      content: (
        <div>
          <p>Learn how the internet works through interactive simulations!</p>
          <p>This tool will show you exactly how data travels from your computer to websites and back.</p>
          <div className="feature-highlight">
            <h4>What you'll discover:</h4>
            <ul>
              <li>🔍 How your computer finds websites</li>
              <li>📦 How data is packaged and sent</li>
              <li>🛤️ The path data takes across the internet</li>
              <li>⚡ Why some websites load faster than others</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Two Ways to Explore 🚀",
      content: (
        <div>
          <div className="exploration-options">
            <div className="option-card packet">
              <h4>🎯 Single Packet Journey</h4>
              <p>Watch how <strong>one piece of data</strong> travels through the internet step-by-step.</p>
              <small>Perfect for understanding the basics!</small>
            </div>
            <div className="option-card website">
              <h4>🌍 Full Website Loading</h4>
              <p>See how an <strong>entire webpage</strong> gets delivered - multiple packets working together.</p>
              <small>Great for seeing the big picture!</small>
            </div>
          </div>
          <p className="recommendation">
            <strong>💡 Tip:</strong> Start with "Single Packet Journey" if you're new to networking!
          </p>
        </div>
      )
    },
    {
      title: "Understanding the Network 🗺️",
      content: (
        <div>
          <p>You'll see different devices that help move data across the internet:</p>
          <div className="device-grid">
            <div className="device-info">
              <span className="device-icon">💻</span>
              <div>
                <strong>Your Computer</strong>
                <p>Where requests start</p>
              </div>
            </div>
            <div className="device-info">
              <span className="device-icon">📡</span>
              <div>
                <strong><TechTerm term="Router">Routers</TechTerm></strong>
                <p>Direct traffic like road signs</p>
              </div>
            </div>
            <div className="device-info">
              <span className="device-icon">📚</span>
              <div>
                <strong><TechTerm term="DNS">DNS Server</TechTerm></strong>
                <p>Internet's address book</p>
              </div>
            </div>
            <div className="device-info">
              <span className="device-icon">🏢</span>
              <div>
                <strong><TechTerm term="Server">Web Server</TechTerm></strong>
                <p>Stores and serves websites</p>
              </div>
            </div>
          </div>
          <p className="interaction-tip">
            <strong>🎯 Try this:</strong> Click on any device during a simulation to learn more about it!
          </p>
        </div>
      )
    },
    {
      title: "Interactive Learning Features ✨",
      content: (
        <div>
          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">🏷️</span>
              <div>
                <strong>Smart Tooltips</strong>
                <p>Hover over technical terms to see simple explanations</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">👆</span>
              <div>
                <strong>Step-by-Step Control</strong>
                <p>Pause, go back, or jump ahead at your own pace</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🎮</span>
              <div>
                <strong>Experiment Mode</strong>
                <p>Try different scenarios and see what happens</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <div>
                <strong>Real-time Stats</strong>
                <p>See how data flows and track network performance</p>
              </div>
            </div>
          </div>
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

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="welcome-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="welcome-guide">
        <div className="welcome-header">
          <h2>{steps[currentStep].title}</h2>
          <button className="welcome-close" onClick={onClose}>×</button>
        </div>
        
        <div className="welcome-content">
          {steps[currentStep].content}
        </div>
        
        <div className="welcome-footer">
          <div className="step-indicators">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
          
          <div className="welcome-actions">
            <button 
              className="welcome-btn secondary" 
              onClick={onClose}
            >
              Skip Tour
            </button>
            
            {currentStep > 0 && (
              <button 
                className="welcome-btn outline" 
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            
            <button 
              className="welcome-btn primary" 
              onClick={handleNext}
            >
              {isLastStep ? "Let's Start!" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
