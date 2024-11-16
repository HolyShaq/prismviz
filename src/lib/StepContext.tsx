"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

type StepContextType = {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    completedSteps: boolean[];
    setCompletedSteps: (steps: boolean[]) => void;
    completeCurrentStep: () => void;
    handleNext: () => void;
    handleBack: () => void;
};

export const StepContext = createContext<StepContextType | undefined>(undefined);

export const StepContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);

    // Mark the current step as complete
    const completeCurrentStep = () => {
        setCompletedSteps((prevSteps) => {
            if (prevSteps[currentStep]) {
                return prevSteps;
            }
            const newSteps = [...prevSteps];
            newSteps[currentStep] = true;
            return newSteps;
        });
    };

    // Move back to the previous step
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };
    
    // Move to the next step
    const handleNext = () => {
        if (currentStep < completedSteps.length - 1 && completedSteps[currentStep]) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };



    return (
        <StepContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                completedSteps,
                setCompletedSteps,
                completeCurrentStep,
                handleNext,
                handleBack,
            }}
        >
            {children}
        </StepContext.Provider>
    );
};

// Custom hook to use StepContext in components
export const useStepContext = () => {
    const context = useContext(StepContext);
    if (!context) {
        throw new Error("useStepContext must be used within a StepContextProvider");
    }
    return context;
};
