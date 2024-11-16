"use client";

import React, { useContext } from "react";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";

// Material-UI icons
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import TextFieldsIcon from "@mui/icons-material/TextFields";

interface RibbonButtonProps {
  label: string;
  Icon: React.ElementType; // Material-UI icon component
  onClick: () => void;
  enabled: boolean;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({
  label,
  Icon,
  onClick,
  enabled,
}) => {
  return enabled ? (
    <div
      onClick={onClick}
      className="flex flex-col w-20 space-y-1 items-center cursor-pointer p-2 rounded-md"
    >
      <div className="h-10 w-10 flex items-center justify-center text-white">
        <Icon fontSize="large" /> {/* Render the Material-UI Icon */}
      </div>
      <span className="text-xs text-wrap text-center text-white">{label}</span>
    </div>
  ) : null;
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
        Icon={RemoveCircleIcon}
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Remove Invalid"
        Icon={CheckCircleIcon}
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Remove Empty"
        Icon={DeleteIcon}
        onClick={temp}
        enabled={true}
      />,
    ],

    // Visualize
    [
      <RibbonButton
        key={0}
        label="Add a Chart"
        Icon={BarChartIcon}
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Add a Textbox"
        Icon={TextFieldsIcon}
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
        Icon={DeleteIcon}
        onClick={() => {
          handleClearFile();
        }}
        enabled={csvData.length > 0}
      />,
      <RibbonButton
        key={1}
        label="Proceed"
        Icon={CheckCircleIcon}
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
        Icon={DeleteIcon}
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Proceed"
        Icon={CheckCircleIcon}
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={true}
      />,
    ],

    // Visualize
    [
      <RibbonButton
        key={0}
        label="Preview"
        Icon={BarChartIcon}
        onClick={temp}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Print"
        Icon={CheckCircleIcon}
        onClick={temp}
        enabled={true}
      />,
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