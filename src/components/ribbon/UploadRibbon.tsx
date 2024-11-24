import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

// Material UI Icons
import ClearIcon from '@mui/icons-material/Clear';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const UploadRibbon: React.FC<{ left?: boolean; right?: boolean }> = ({
  left = false,
  right = false,
}) => {
  const { csvData, clearFile } = useContext(CsvContext);
  const { completeCurrentStep, handleStepNext, setCompletedSteps, setCurrentStep } =
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
        Icon={ClearIcon}
        onClick={handleClearFile}
        enabled={csvData.length > 0}
        tooltip="Clear CSV File: Go back to uploaded file screen"
      />,
      <RibbonButton
        key={1}
        Icon={ArrowCircleRightIcon}
        onClick={() => {
          completeCurrentStep();
          handleStepNext();
        }}
        enabled={csvData.length > 0}
        tooltip="Proceed to Data Cleaning: Proceed to the next section."
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
