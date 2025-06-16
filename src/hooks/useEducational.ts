import { useContext } from 'react';
import { EducationalContext } from '@/contexts/EducationalContext';

export const useEducational = () => {
  const context = useContext(EducationalContext);
  if (context === undefined) {
    throw new Error('useEducational must be used within an EducationalProvider');
  }
  return context;
};
