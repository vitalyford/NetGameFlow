import React from 'react';
import { useEducational } from '../hooks/useEducational';
import { getNetworkExplanation } from '../utils/networkExplanations';

interface TechTermProps {
  term: string;
  children: React.ReactNode;
}

export const TechTerm: React.FC<TechTermProps> = ({ term, children }) => {
  const { showPopup } = useEducational();
  const explanation = getNetworkExplanation(term);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (explanation) {
      showPopup({
        id: `tech-term-${term}`,
        title: explanation.title,
        content: explanation.content
      });
    }
  };

  // If no explanation exists, just render the children without interaction
  if (!explanation) {
    return <>{children}</>;
  }

  return (
    <span
      className="tech-term clickable"
      onClick={handleClick}
      title={`Click to learn more about ${term}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          if (explanation) {
            showPopup({
              id: `tech-term-${term}`,
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
