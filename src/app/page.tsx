"use client";

import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import Ribbon from "../components/Ribbon";
import UploadPage from "../components/UploadPage";
import CleanPage from "../components/CleanPage";
import VisualizePage from "../components/VisualizePage";
import { CsvContextProvider, CsvContext } from "../lib/CsvContext";

type Step = {
  name: string;
  component: React.FC<any>;
};

// Define steps
const steps: Step[] = [
  { name: "Upload CSV File", component: UploadPage },
  { name: "Data Cleaning", component: CleanPage },
  { name: "Visualization and Reporting", component: VisualizePage },
];

const HomeContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // Move to the next step
  const handleNext = () => {
    if (currentStep < steps.length - 1 && completedSteps[currentStep]) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move back to the previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  // Render the current step's component
  const StepComponent = steps[currentStep].component;

  return (
    <div className="flex flex-col h-screen w-screen max-w-screen max-h-screen overflow-clip">
      <div className="flex flex-row w-full pb-1 items-center space-x-4 px-4 bg-[#d9d9d9]">
        <img src="/prismicon.ico" alt="logo" className="w-16 h-16 my-4" />
        <div className="flex flex-col items-start space-y-1 my-1 w-full">
          <div className="flex flex-row space-x-2 font-sans text-sm">
            <span>File</span>
            <span>Home</span>
            <span>Help</span>
          </div>
          <Ribbon
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setCompletedSteps={setCompletedSteps}
          />
        </div>
      </div>

      <div className="flex flex-row h-full max-h-full max-w-full">
        <Sidebar
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          completedSteps={completedSteps}
        />

        <div className="flex flex-col max-h-full max-w-full p-4">
          <StepComponent
            setCurrentStep={setCurrentStep}
            onComplete={completeCurrentStep}
            setCompletedSteps={setCompletedSteps}
          />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <CsvContextProvider>
      <HomeContent />
    </CsvContextProvider>
  );
}
