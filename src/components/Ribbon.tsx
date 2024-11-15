"use client";

import { Skeleton } from "@mui/material";
import React, { useContext } from "react";
import { CsvContext } from "../lib/CsvContext";

interface RibbonProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setCompletedSteps: (steps: boolean[]) => void;
}

interface RibbonButtonProps {
  //  TODO: Implement icons
  // icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({ label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col w-16 space-y-1 items-center"
    >
      <div className="h-10 aspect-square bg-slate-500" />
      <span className="text-xs text-wrap text-center w-max-full">{label}</span>
    </div>
  );
};

const Ribbon: React.FC<RibbonProps> = ({
  currentStep,
  setCurrentStep,
  setCompletedSteps,
}) => {
  const { csvData, clearFile } = useContext(CsvContext);

  const temp = () => {};

  const buttonSetsLeft = [
    // Upload
    [],

    // Clean
    [
      <RibbonButton key={0} label="Remove Duplicate" onClick={temp} />,
      <RibbonButton key={1} label="Remove Invalid" onClick={temp} />,
      <RibbonButton key={2} label="Remove Empty" onClick={temp} />,
    ],

    // Visualize
    [
      <RibbonButton key={0} label="Add a Chart" onClick={temp} />,
      <RibbonButton key={1} label="Add a Textbox" onClick={temp} />,
      <RibbonButton key={2} label="Add Controls" onClick={temp} />,
    ],
  ];

  const buttonSetsRight = [
    // Upload
    [
      <RibbonButton
        key={0}
        label="Clear"
        onClick={() => {
          clearFile();
          setCompletedSteps([false, false, false]);
          setCurrentStep(0);
        }}
      />,
      <RibbonButton
        key={1}
        label="Proceed"
        onClick={() => {
          setCompletedSteps([true, false, false]);
          setCurrentStep(1);
        }}
      />,
    ],

    // Clean
    [
      <RibbonButton key={0} label="Delete Rows" onClick={temp} />,
      <RibbonButton key={1} label="Proceed" onClick={temp} />,
    ],

    // Visualize
    [
      <RibbonButton key={0} label="Preview" onClick={temp} />,
      <RibbonButton key={1} label="Print" onClick={temp} />,
    ],
  ];

  return (
    <div className="flex flex-row h-20 w-full justify-between">
      <div className="flex flex-row space-x-2">
        {buttonSetsLeft[currentStep].map((button) => button)}
      </div>
      <div className="flex flex-row space-x-2">
        {buttonSetsRight[currentStep].map((button) => button)}
      </div>
    </div>
  );
};

export default Ribbon;
