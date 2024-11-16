"use client";

import React from "react";
import Sidebar from "../components/Sidebar";
import Ribbon from "../components/ribbon/Ribbon";
import UploadPage from "../components/UploadPage";
import CleanPage from "../components/CleanPage";
import VisualizePage from "../components/VisualizePage";
import { CsvContextProvider, CsvContext } from "../lib/CsvContext";
import { StepContextProvider, useStepContext } from "../lib/StepContext";

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
  const { currentStep, handleNext, handleBack } = useStepContext();

  // Render the current step's component
  const StepComponent = steps[currentStep].component;

  return (
    <div className="flex flex-col h-screen w-screen max-w-screen max-h-screen overflow-clip">
      {/* Ribbon Section */}
      <div className="flex flex-row w-full pb-1 items-center space-x-4 px-4 bg-[#d9d9d9]">
        <img src="/prismicon.ico" alt="logo" className="w-16 h-16 my-4" />
        <div className="flex flex-col items-start space-y-1 my-1 w-full">
          <div className="flex flex-row space-x-2 font-sans text-sm">
            <span>File</span>
            <span>Home</span>
            <span>Help</span>
          </div>
          <Ribbon />
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-row h-full max-h-full max-w-full">
        {/* Sidebar */}
        <Sidebar steps={steps} />
        {/* Step Component */}
        <div className="flex flex-col max-h-full max-w-full p-4">
          <StepComponent />
        </div>
      </div>
      {/* Navigation Buttons */} 
    </div>
  );
};

export default function Home() {
  return (
    <CsvContextProvider>
      <StepContextProvider>
        <HomeContent />
      </StepContextProvider>
    </CsvContextProvider>
  );
}
