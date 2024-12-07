"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Ribbon from "../components/ribbon/Ribbon";
import UploadPage from "../components/UploadPage";
import CleanPage from "../components/CleanPage";
import VisualizePage from "../components/VisualizePage";
import HeroPage from "../components/HeroPage"; 
import SplashScreen from "../components/SplashScreen"; 
import { CsvContextProvider } from "../lib/CsvContext";
import { StepContextProvider, useStepContext } from "../lib/StepContext";
import { ChartContextProvider } from "../lib/ChartContext";
import { DataCleaningProvider } from "../lib/DataCleaningContext";

// Main HomeContent Component (Dashboard)
const HomeContent: React.FC = () => {
  const { currentStep } = useStepContext();

  // Steps for the dashboard
  const steps = [
    { name: "Upload CSV File", component: UploadPage },
    { name: "Data Cleaning", component: CleanPage },
    { name: "Visualization and Reporting", component: VisualizePage },
  ];

  const StepComponent = steps[currentStep].component;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-y-hidden bg-primary-main text-neutral-white-10">
      {/* Navigation Bar */}
      <div className="flex items-center px-6 py-3 bg-primary-hover shadow-md">
        <img src="/prismicon.ico" alt="logo" className="w-12 h-12" />
        <div className="flex flex-col items-start space-y-1 my-1 w-full">
          <div className="flex space-x-6 font-semibold text-white ml-2">
            <span className="cursor-pointer hover:opacity-75">File</span>
            <span className="cursor-pointer hover:opacity-75">Home</span>
            <span className="cursor-pointer hover:opacity-75">Help</span>
          </div>
          <div className="bg-primary-pressed rounded-lg py-1 px-4 w-full">
            <Ribbon />
          </div>
        </div>
      </div>
      <div className="flex flex-grow max-h-[calc(100vh-108px)]">
        {/* Sidebar */}
        <Sidebar steps={steps} />
        {/* Step Content */}
        <div className="flex flex-col p-6 w-full max-h-full overflow-y-auto">
          <StepComponent />
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    // Show SplashScreen for 5 seconds total (Primary Logo + Name Logo)
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
      setShowHero(true);
    }, 1000); // Adjust based on your animation duration

    return () => clearTimeout(splashTimeout);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showHero) {
    return (
      <HeroPage
        onGetStarted={() => {
          setShowHero(false); // Transition to the dashboard
        }}
      />
    );
  }

  return <HomeContent />;
};

export default function Home() {
  return (
    <StepContextProvider>
      <CsvContextProvider>
        <ChartContextProvider>
          <DataCleaningProvider>
          <Page />
          </DataCleaningProvider>
        </ChartContextProvider>
      </CsvContextProvider>
    </StepContextProvider>
  );
}
