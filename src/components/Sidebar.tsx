"use client";

import React from "react";

type Step = {
  name: string;
  component: React.FC<{ onComplete: () => void }>;
};

interface SidebarProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  completedSteps: boolean[];
}

// TODO: Adjust logic for step completion
const Sidebar: React.FC<SidebarProps> = ({ steps, currentStep, setCurrentStep, completedSteps }) => {
  return (
    <div className="flex flex-col space-y-2 p-2 outline outline-1 outline-[#d9d9d9]">
      {steps.map((step, index) => (
        <button
          key={index}
          onClick={() => {
            if (index === currentStep || completedSteps[index] || index === currentStep - 1) {
              setCurrentStep(index);
            }
          }}
          className={`w-8 h-8 ${
            index <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
          } ${completedSteps[index] || index === currentStep ? "bg-blue-500" : "bg-gray-300"}`}
          disabled={!completedSteps[index] && index > currentStep} // Disable next steps if they’re not completed
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
