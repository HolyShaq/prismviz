"use client";

import React, { useContext } from "react";
import UploadRibbon from "./UploadRibbon";
import CleanRibbon from "./CleanRibbon";
import VisualizeRibbon from "./VisualizeRibbon";
import { CsvContext } from "../../lib/CsvContext"; // Assuming you use `` for CsvContext
import { useStepContext } from "../../lib/StepContext";

const Ribbon: React.FC = () => {
  const { currentStep } = useStepContext();
  const buttonSets = [UploadRibbon, CleanRibbon, VisualizeRibbon];
  const ActiveButtonSet = buttonSets[currentStep];

  return (
    <div className="flex flex-row h-20 w-full justify-between">
      <div className="flex flex-row space-x-2">
        <ActiveButtonSet left />
      </div>
      <div className="flex flex-row space-x-2">
        <ActiveButtonSet right />
      </div>
    </div>
  );
};

export default Ribbon;
