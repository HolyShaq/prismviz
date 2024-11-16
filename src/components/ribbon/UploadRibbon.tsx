import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

const UploadRibbon: React.FC<{ left?: boolean; right?: boolean }> = ({
  left = false,
  right = false,
}) => {
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
  type UploadButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };

  const UploadButtonSet: UploadButtonSetType = {
    left: [
      // Left Ribbon Buttons
    ],

    right: [
      // Right Ribbon Buttons
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
  };

  return (
    <>
      {left ? UploadButtonSet.left.map((button) => button) : null}
      {right ? UploadButtonSet.right.map((button) => button) : null}
    </>
  );
};

export default UploadRibbon;
