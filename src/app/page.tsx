"use client";

import React, { useState, useContext } from "react";
import { Skeleton } from "@mui/material";
import Sidebar from "../components/Sidebar";
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
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);

  const { csvFile, csvData, clearFile, handleFileLoaded } = useContext(CsvContext);

  // Go to the data cleaning step (2nd step)
  const goToDataCleaningStep = () => {
    setCurrentStep(1);
  };

  // Move to the next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    console.log("Completing current step:", currentStep);
    setCompletedSteps((prevSteps) => {
      if (prevSteps[currentStep]) {
        return prevSteps; // No change if already complete
      }
      const newSteps = [...prevSteps];
      newSteps[currentStep] = true;
      console.log("Updated steps:", newSteps);
      return newSteps;
    });
    handleNext(); // Automatically move to the next step
  };

  // Render the current step's component
  const StepComponent = steps[currentStep].component;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row w-full space-x-4 px-4 bg-[#d9d9d9]">
        <img src="favicon.ico" alt="logo" className="w-16 h-16 my-4" />
        <div className="flex flex-col space-y-1 my-3 w-full">
          <div className="flex flex-row space-x-2 font-sans text-sm">
            <span>File</span>
            <span>Home</span>
            <span>Help</span>
          </div>
          <Skeleton variant="rectangular" animation={false} className="w-full h-full" />
        </div>
      </div>

      <div className="flex flex-row h-full">
        <Sidebar
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={(step) => setCurrentStep(step)}
          completedSteps={completedSteps}
          isCsvUploaded={!!csvFile}
        />

        <div className="flex flex-col h-full w-full p-4">
          <StepComponent
            onBack={handleBack}
            onComplete={completeCurrentStep}
            csvFile={csvFile}
            csvData={csvData}
            handleFileLoaded={handleFileLoaded}
            clearFile={clearFile}
            goToDataCleaningStep={goToDataCleaningStep}
            cleanedData={csvData} // TODO: Pass cleaned data to visualization step (placeholder as of now)
          />

          <div className="flex space-x-4 mt-8">
            <button onClick={handleBack} disabled={currentStep === 0} className="px-4 py-2 bg-gray-300 rounded">
              Back
            </button>
            <button onClick={handleNext} disabled={!completedSteps[currentStep]} className="px-4 py-2 bg-blue-500 text-white rounded">
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// TODO: Set global css properties
export default function Home() {
  return (
    <CsvContextProvider>
      <HomeContent />
    </CsvContextProvider>
  );
}
