"use client";

import React, { useContext } from "react";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";

type Step = {
  name: string;
  component: React.FC<any>;
};

interface SidebarProps {
  steps: Step[];
}

const Sidebar: React.FC<SidebarProps> = ({ steps }) => {
  const { currentStep, setCurrentStep, completedSteps } = useStepContext();
  const { csvFile } = useContext(CsvContext);
  const isCsvUploaded = !!csvFile;

  return (
    <div className="flex flex-col space-y-2 p-2 outline outline-1 outline-[#d9d9d9]">
      {steps.map((step, index) => {
        const isDisabled =
          !completedSteps[index] &&
          ((index === 1 && !isCsvUploaded) || // Step 2 requires a CSV upload
            (index === 2 && !completedSteps[1])); // Step 3 requires Step 2 to be completed

        return (
          <button
            key={index}
            onClick={() => {
              if (!isDisabled) {
                setCurrentStep(index);
              }
            }}
            className={`w-8 h-8 ${
              !isDisabled ? "cursor-pointer" : "cursor-not-allowed"
            } ${
              completedSteps[index] ||
              index === currentStep ||
              (index === 0 && isCsvUploaded)
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
