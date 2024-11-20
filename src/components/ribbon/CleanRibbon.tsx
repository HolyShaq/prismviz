import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { useStepContext } from "../../lib/StepContext";
import { CsvContext } from "../../lib/CsvContext";

// Material-UI icons
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

const CleanRibbon: React.FC<{ left?: boolean; right?: boolean }> = ({
  left = false,
  right = false,
}) => {
  const { cleanStep, completeCleanStep, completeCurrentStep, handleStepNext, cleanStepCompleted } = useStepContext(); // Access cleaning step context
  const { handleMissingData, removeDuplicates, validateColumns } = useContext(CsvContext); // Access cleaning methods from CsvContext

  type CleanButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };
  // Trigger cleaning logic based on the current step
  const triggerCleaningStep = () => {
    if (cleanStep === 0) {
      handleMissingData();
    } else if (cleanStep === 1) {
      removeDuplicates();
    } else if (cleanStep === 2) {
      validateColumns();
    }
    completeCleanStep(); // Mark the current cleaning step as complete
  };

  // Check if all cleaning steps are complete
  const allStepsComplete = cleanStepCompleted.every((step) => step === true);

  const CleanButtonSet: CleanButtonSetType = {
    left: [
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={() => {
          console.log("Handle Missing Data action triggered.");
          alert("Handle Missing Data action triggered.");
          triggerCleaningStep();
        }}
        enabled={cleanStep === 0}
        tooltip="Handle Missing Data: Deletes or fills missing values"
      />,
      <RibbonButton
        key={1}
        Icon={RemoveCircleIcon}
        onClick={() => {
          console.log("Remove Duplicate Entries action triggered.");
          triggerCleaningStep();
        }}
        enabled={cleanStep === 1}
        tooltip="Remove Duplicate Entries: Deletes duplicate rows"
      />,
      <RibbonButton
        key={2}
        Icon={CheckCircleIcon}
        onClick={() => {
          console.log("Validate Column Entries action triggered.");
          triggerCleaningStep(); // Trigger cleaning for "Validate Column Entries"
        }}
        enabled={cleanStep === 2}
        tooltip="Validate Column Entries: Ensures column values meet criteria"
      />,
    ],
    right: [
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={() => {
          console.log("Delete Rows action executed.");
        }}
        enabled={true}
        tooltip="Delete Rows: Remove selected rows"
      />,
      // Conditionally include the "Proceed" button if all steps are complete
      ...(cleanStepCompleted.every((step) => step === true)
        ? [
          <RibbonButton
            key={1}
            Icon={CheckCircleIcon}
            onClick={() => {
              console.log("Proceed action executed.");
              completeCurrentStep();
              handleStepNext();
            }}
            enabled={true}
            tooltip="Proceed: Move to the next step"
          />,
        ]
        : []), // Return an empty array if the condition is not met
    ],
  };

  return (
    <>
      {left ? CleanButtonSet.left.map((button) => button) : null}
      {right ? CleanButtonSet.right.map((button) => button) : null}
    </>
  );
};

export default CleanRibbon;
