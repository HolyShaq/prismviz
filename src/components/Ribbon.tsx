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
import { Tooltip } from "@mui/material";

interface RibbonButtonProps {
  Icon: React.ElementType; // Material-UI icon component
  onClick: () => void;
  enabled: boolean;
  tooltip: string;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({
  Icon,
  onClick,
  enabled,
  tooltip,
}) => {
  return enabled ? (
    <Tooltip title={tooltip} arrow>
      <div
        onClick={onClick}
        className="flex flex-col w-20 space-y-1 items-center cursor-pointer p-2 rounded-md"
      >
        <div className="h-10 w-10 flex items-center justify-center text-white">
          <Icon fontSize="large" /> {/* Render the Material-UI Icon */}
        </div>
      </div>
    </Tooltip>
  ) : null;
};

const Ribbon: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    setCompletedSteps,
    completeCurrentStep,
    handleNext,
  } = useStepContext();
  const { csvData, clearFile } = useContext(CsvContext);

  const temp = () => {}; // Placeholder for additional actions

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
        Icon={RemoveCircleIcon}
        onClick={temp}
        enabled={true}
        tooltip="Remove Duplicate: Deletes duplicate entries"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={temp}
        enabled={true}
        tooltip="Remove Invalid: Identifies and removes invalid data"
      />,
      <RibbonButton
        key={2}
        Icon={DeleteIcon}
        onClick={temp}
        enabled={true}
        tooltip="Remove Empty: Deletes empty entries"
      />,
    ],

    // Visualize
    [
      <RibbonButton
        key={0}
        Icon={BarChartIcon}
        onClick={temp}
        enabled={true}
        tooltip="Add a Chart: Visualize your data with a chart"
      />,
      <RibbonButton
        key={1}
        Icon={TextFieldsIcon}
        onClick={temp}
        enabled={true}
        tooltip="Add a Textbox: Annotate your visualization"
      />,
    ],
  ];

  const buttonSetsRight = [
    // Upload
    [
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={handleClearFile}
        enabled={csvData.length > 0}
        tooltip="Clear: Removes all uploaded data"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={csvData.length > 0}
        tooltip="Proceed: Move to the next step"
      />,
    ],

    // Clean
    [
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={temp}
        enabled={true}
        tooltip="Delete Rows: Remove selected rows"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={true}
        tooltip="Proceed: Move to the next step"
      />,
    ],

    // Visualize
    [
      <RibbonButton
        key={0}
        Icon={BarChartIcon}
        onClick={temp}
        enabled={true}
        tooltip="Preview: View your chart before finalizing"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={temp}
        enabled={true}
        tooltip="Print: Print your chart and annotations"
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
