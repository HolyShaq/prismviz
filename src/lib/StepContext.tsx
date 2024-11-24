"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

type StepContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: boolean[];
  setCompletedSteps: (steps: boolean[]) => void;
  completeCurrentStep: () => void;
  handleStepBack: () => void;
  // Cleaning step properties
  cleanStep: number;
  setCleanStep: (step: number) => void;
  cleanStepCompleted: boolean[];
  setCleanStepCompleted: React.Dispatch<React.SetStateAction<boolean[]>>;
  completeCleanStep: () => void;
  isCurrentCleanStepComplete: boolean; 
  handleCleanStepNext: () => void;
  handleCleanStepBack: () => void;
};

export const StepContext = createContext<StepContextType | undefined>(
  undefined
);

export const StepContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const [cleanStep, setCleanStep] = useState<number>(0);
  const [cleanStepCompleted, setCleanStepCompleted] = useState<boolean[]>([false, false, false]);
  

  const completeCurrentStep = () => {
    setCompletedSteps((prev) => {
      const newSteps = [...prev];
      newSteps[currentStep] = true;
      return newSteps;
    });
     // Move to the next step immediately after marking as complete
    if (currentStep < completedSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const completeCleanStep = () => {
    setCleanStepCompleted((prev) => {
      const newSteps = [...prev];
      newSteps[cleanStep] = true; // Mark current step as complete
      return newSteps;
    });
  };

  const handleCleanStepNext = () => {
    setCleanStep((prev) => (prev < cleanStepCompleted.length - 1 ? prev + 1 : prev));
  };

  const handleCleanStepBack = () => {
    if (cleanStep > 0) {
      setCleanStep((prev) => prev - 1);
    }
  };

  const isCurrentCleanStepComplete = cleanStepCompleted[cleanStep] || false; // Derived state

  return (
    <StepContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        completedSteps,
        setCompletedSteps,
        completeCurrentStep,
        handleStepBack,
        // Cleaning step methods
        cleanStep,
        setCleanStep,
        cleanStepCompleted,
        setCleanStepCompleted,
        completeCleanStep,
        handleCleanStepNext,
        handleCleanStepBack,
        isCurrentCleanStepComplete,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export const useStepContext = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used within a StepContextProvider");
  }
  return context;
};
