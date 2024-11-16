"use client";

import React, { useContext } from "react";
import { CsvContext } from "../lib/CsvContext"; // Assuming you use `` for CsvContext
import { useStepContext } from "../lib/StepContext";

interface RibbonButtonProps {
  label: string;
  onClick: () => void;
  enabled: boolean;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({
  label,
  onClick,
  enabled,
}) => {
  return enabled ? (
    <div
      onClick={onClick}
      className="flex flex-col w-16 space-y-1 items-center cursor-pointer"
    >
      <div className="h-10 aspect-square bg-slate-500" />
      <span className="text-xs text-wrap text-center w-max-full">{label}</span>
    </div>
  ) : (
    <></>
  );
};

const Ribbon: React.FC = () => {
  const { currentStep, setCurrentStep, setCompletedSteps, completeCurrentStep, handleNext } =
    useStepContext();
  const { csvData, clearFile } = useContext(CsvContext);

  const temp = () => { }; // Placeholder for additional actions

  const handleClearFile = () => {
    clearFile(); // Clears file data from CsvContext
    setCompletedSteps([false, false, false]); // Resets all step completions
    setCurrentStep(0);
  };
  
  const buttonSetsLeft = [
    // Upload
    [],

    // Clean
    [
      <RibbonButton
        key={0}
        label="Remove Duplicate"
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Remove Invalid"
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Remove Empty"
        onClick={temp}
        enabled={true}
      />,
    ],

    // Visualize
    [
      <RibbonButton
        key={0}
        label="Add a Chart"
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Add a Textbox"
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Add Controls"
        onClick={temp}
        enabled={true}
      />,
    ],
  ];

  const buttonSetsRight = [
    // Upload
    [
      <RibbonButton
        key={0}
        label="Clear"
        onClick={() => {
          handleClearFile();
        }}
        enabled={csvData.length > 0}
      />,
      <RibbonButton
        key={1}
        label="Proceed"
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={csvData.length > 0}
      />,
    ],

    // Clean
    [
      <RibbonButton
        key={0}
        label="Delete Rows"
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Proceed"
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={true}
      />,
    ],

    // Visualize
    [
      <RibbonButton key={0} label="Preview" onClick={temp} enabled={true} />,
      <RibbonButton key={1} label="Print" onClick={temp} enabled={true} />,
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
