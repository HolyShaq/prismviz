"use client";

import React, { useContext } from "react";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";
import UploadIcon from "@mui/icons-material/Upload";
import DatasetIcon from "@mui/icons-material/Dataset";
import AddchartIcon from "@mui/icons-material/Addchart";

type Step = {
  name: string;
  component: React.FC;
};

interface SidebarProps {
  steps: Step[];
}

const Sidebar: React.FC<SidebarProps> = ({ steps }) => {
  const { currentStep, setCurrentStep, completedSteps } = useStepContext();
  const { csvFile } = useContext(CsvContext);
  const isCsvUploaded = !!csvFile;

  // Define icons for each step
  const stepIcons = [
    <UploadIcon key={0} fontSize="medium" />, // Medium size for smaller icons
    <DatasetIcon key={1} fontSize="medium" />,
    <AddchartIcon key={2} fontSize="medium" />,
  ];

  return (
    <div className="flex flex-col bg-primary-pressed p-2 w-16 h-full text-neutral-white-10 space-y-2">
      {steps.map((_step, index) => {
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
            className={`w-full p-2 text-center rounded-lg flex items-center justify-center ${
              !isDisabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            } ${
              completedSteps[index] ||
              index === currentStep ||
              (index === 0 && isCsvUploaded)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            disabled={isDisabled}
          >
            {stepIcons[index]}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
