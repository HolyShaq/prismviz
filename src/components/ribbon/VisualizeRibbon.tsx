import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

const VisualizeRibbon: React.FC = () => {
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
  type VisualizeButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };

  const VisualizeButtonSet: VisualizeButtonSetType = {
    left: [
      // Left Ribbon Buttons
      <RibbonButton
        key={0}
        label="Add a Chart"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Add a Textbox"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Add Controls"
        onClick={() => {}}
        enabled={true}
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        label="Preview"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton key={1} label="Print" onClick={() => {}} enabled={true} />,
    ],
  };

  return (
    <>
      <div className="flex flex-row space-x-2">
        {VisualizeButtonSet["left"].map((button) => button)}
      </div>
      <div className="flex flex-row space-x-2">
        {VisualizeButtonSet["right"].map((button) => button)}
      </div>
    </>
  );
};

export default VisualizeRibbon;
