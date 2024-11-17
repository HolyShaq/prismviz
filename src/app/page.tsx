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
    <div className="flex flex-col h-screen bg-primary-main text-neutral-white-10">
      {/* Navigation Bar  */}
      <div className="flex items-center justify-between px-6 py-3 bg-primary-hover shadow-md">
        <img src="/prismicon.ico" alt="logo" className="w-16 h-16 my-4" />
        <div className="flex flex-col items-start space-y-1 my-1 w-full">
          <div className="flex space-x-6 font-semibold text-white ml-4">
            <span className="cursor-pointer hover:opacity-75">File</span>
            <span className="cursor-pointer hover:opacity-75">Home</span>
            <span className="cursor-pointer hover:opacity-75">Help</span>
          </div>
          {/* Ribbon Section */}
          <Ribbon />
        </div>
      </div>
      {/* Main Content */}
      <div className="flex h-screen bg-primary-main text-neutral-white-10">
        {/* Sidebar */}
        <Sidebar steps={steps} />
        {/* Step Component */}
        <div className="flex flex-col flex-grow p-6 overflow-hidden">
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
