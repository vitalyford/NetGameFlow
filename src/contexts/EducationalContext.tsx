import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { EducationalPopup } from '../types';

interface EducationalContextType {
  showPopup: (content: EducationalPopup) => void;
  hidePopup: () => void;
  currentPopup: EducationalPopup | null;
}

const EducationalContext = createContext<EducationalContextType | undefined>(undefined);

export { EducationalContext };

interface EducationalProviderProps {
  children: ReactNode;
}

export const EducationalProvider: React.FC<EducationalProviderProps> = ({ children }) => {
  const [currentPopup, setCurrentPopup] = useState<EducationalPopup | null>(null);

  const showPopup = (content: EducationalPopup) => {
    setCurrentPopup(content);
  };

  const hidePopup = () => {
    setCurrentPopup(null);
  };
  return (
    <EducationalContext.Provider value={{ showPopup, hidePopup, currentPopup }}>
      {children}
    </EducationalContext.Provider>
  );
};
