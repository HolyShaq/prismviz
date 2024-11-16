import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

const CleanRibbon: React.FC = () => {
  // Initialization
  const { csvData, clearFile } = useContext(CsvContext);
  const { completeCurrentStep, handleNext, setCompletedSteps, setCurrentStep } =
    useStepContext();

  // Functions
  const handleClearFile = () => {
    clearFile(); // Clears file data from CsvContext
    setCompletedSteps([false, false, false]); // Resets all step completions
    setCurrentStep(0);
  };

  // Button Set Definition
  type CleanButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };

  const CleanButtonSet: CleanButtonSetType = {
    left: [
      // Left Ribbon Buttons
      <RibbonButton
        key={0}
        label="Remove Duplicate"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Remove Invalid"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Remove Empty"
        onClick={() => {}}
        enabled={true}
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        label="Delete Rows"
        onClick={() => {}}
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
  };

  return (
    <>
      <div className="flex flex-row space-x-2">
        {CleanButtonSet["left"].map((button) => button)}
      </div>
      <div className="flex flex-row space-x-2">
        {CleanButtonSet["right"].map((button) => button)}
      </div>
    </>
  );
};

export default CleanRibbon;
