import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { useStepContext } from "../../lib/StepContext";
import { DataCleaningContext } from "../../lib/DataCleaningContext";

// Material-UI icons
import SearchOffIcon from "@mui/icons-material/SearchOff";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Material UI Icons for proceed and clearing uploaded data
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { CsvContext } from "@/lib/CsvContext";

const CleanRibbon: React.FC<{ left?: boolean; right?: boolean }> = ({
  left = false,
  right = false,
}) => {
  const {
    cleanStep,
    setCleanStep,
    completeCurrentStep,
    setCleanStepCompleted,
    cleanStepCompleted,
  } = useStepContext(); // Access cleaning step context
  const { handleMissingData, removeDuplicates, validateColumns } =
    useContext(DataCleaningContext); // Access data cleaning methods from DataCleaningContext
  const { selectedRowIds, deleteSelectedRows } = useContext(CsvContext);
  type CleanButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };
  // Trigger cleaning logic based on the current step
  const triggerCleaningStep = (step: number) => {
    console.log(`Triggering cleaning for step: ${step}`);

    // Allow navigation to any step
    setCleanStep(step);

    // Execute cleaning logic for the step
    if (step === 0) handleMissingData();
    if (step === 1) removeDuplicates();
    if (step === 2) validateColumns();

    // Mark the step as completed
    setCleanStepCompleted((prev) => {
      const updatedSteps = [...prev];
      updatedSteps[step] = true; // Mark current step as complete
      if (step < updatedSteps.length - 1) {
        updatedSteps[step + 1] = true; // Enable the next step
      }
      console.log(
        "Updated cleanStepCompleted after re-triggering step logic:",
        updatedSteps,
      );
      return updatedSteps;
    });
  };

  const CleanButtonSet: CleanButtonSetType = {
    left: [
      <RibbonButton
        key={0}
        Icon={SearchOffIcon}
        onClick={() => triggerCleaningStep(0)}
        enabled={true}
        tooltip="Handle Missing Data: 
Delete or Replace empty entries"
      />,
      <RibbonButton
        key={1}
        Icon={RemoveCircleIcon}
        onClick={() => triggerCleaningStep(1)}
        enabled={true}
        tooltip="Remove Duplicate Entries:
Delete duplicate entries"
      />,
      <RibbonButton
        key={2}
        Icon={CheckCircleIcon}
        onClick={() => triggerCleaningStep(2)}
        enabled={true}
        tooltip="Validate Column Entry:
Automatically Standardize Columns"
      />,
    ],
    right: [
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={() => {
          deleteSelectedRows();
        }}
        enabled={selectedRowIds.size > 0}
        tooltip="Delete Selected Row/s:
    Delete specific rows"
      />,
      // Conditionally include the "Proceed" button if all steps are complete
      ...(cleanStepCompleted.every((step) => step === true) &&
      cleanStep === cleanStepCompleted.length - 1
        ? [
            <RibbonButton
              key={1}
              Icon={ArrowCircleRightIcon}
              onClick={() => {
                completeCurrentStep();
              }}
              enabled={true}
              tooltip="Proceed to Data Visualization:
      Proceed to the next section"
            />,
          ]
        : []), // Return an empty array if the condition is not met
    ],
  };

  return (
    <>
      {left
        ? CleanButtonSet.left.map((button, index) => (
            <div
              style={{
                opacity:
                  cleanStepCompleted[index] || cleanStep === index ? 1 : 0.5, // Fully visible if the step is complete or it's the current step
                pointerEvents:
                  cleanStepCompleted[index] || cleanStep === index
                    ? "auto"
                    : "none", // Disable interaction for incomplete steps
              }}
              key={index}
            >
              {button}
            </div>
          ))
        : null}
      {right ? CleanButtonSet.right.map((button) => button) : null}
    </>
  );
};

export default CleanRibbon;
