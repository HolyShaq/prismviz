"use client";

import React from "react";

type Step = {
  name: string;
  component: React.FC<any>;
};

interface SidebarProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  completedSteps: boolean[];
  isCsvUploaded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  completedSteps,
  isCsvUploaded,
}) => {
  return (
    <div className="flex flex-col space-y-2 p-2 outline outline-1 outline-[#d9d9d9]">
      {steps.map((step, index) => {
         const isDisabled =
         (index === 1 && !isCsvUploaded) || // Step 2 requires CSV to be uploaded
         (index === 2 && !completedSteps[1]); // Step 3 requires Step 2 to be completed

        return (
          <button
            key={index}
            onClick={() => {
              if (!isDisabled) {
                setCurrentStep(index);
              }
            }}
            className={`w-8 h-8 ${
              index <= currentStep || (index === 1 && isCsvUploaded)
                ? "cursor-pointer"
                : "cursor-not-allowed"
            } ${
              completedSteps[index] || index === currentStep
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
            disabled={isDisabled}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
