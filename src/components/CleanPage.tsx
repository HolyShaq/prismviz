import React, { useContext } from "react";
import { Box, Typography, Stepper, Step, StepLabel, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";
import { CsvContextProvider } from "../lib/CsvContext";
import CleanRibbon from "./ribbon/CleanRibbon";

const cleaningSteps = [
  "Handle Missing Data",
  "Remove Duplicate Entries",
  "Validate Column Entries",
];

const CleanPage: React.FC = () => {
  const { csvData } = useContext(CsvContext); // Access CSV data
  const {
    cleanStep,
    setCleanStep,
    handleCleanStepNext,
    handleCleanStepBack,
    completeCurrentStep,
    isCurrentCleanStepComplete,
    cleanStepCompleted,
  } = useStepContext();


  if (csvData.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: "center",
          mt: 4,
          color: "var(--neutral-black-100)",
        }}
      >
        No data available
      </Typography>
    );
  }

  const columns: GridColDef[] = Object.keys(csvData[0]).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
    minWidth: 150,
    editable: true,
  }));

  const rows = csvData.map((row, index) => ({ id: index, ...row }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "var(--neutral-white-10)",
      }}
    >
      {/* Stepper */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "var(--neutral-white-20)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stepper activeStep={cleanStep} alternativeLabel>
          {cleaningSteps.map((label, index) => {
            const isAllStepsCompleted = cleanStepCompleted.every((complete) => complete); // Check if all steps are complete
            const isClickable = isAllStepsCompleted || index <= cleanStepCompleted.findIndex((complete) => !complete);
            return (
              <Step key={index}>
                <StepLabel
                  onClick={() => {
                    if (isClickable) {
                      setCleanStep(index); // Allow navigation to completed or current steps
                    } else {
                      alert("Complete previous steps first!");
                    }
                  }}
                  className={`step-label ${isClickable ? "" : "disabled-step"}`} // Conditional class
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {/* Ribbon */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "var(--neutral-white-20)",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
      </Box>

      {/* DataGrid */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: "var(--neutral-white-10)",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-root": {
              color: "var(--neutral-black-100)",
              backgroundColor: "var(--neutral-white-10)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--neutral-white-20)",
              color: "var(--neutral-black-100)",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              color: "var(--neutral-black-100)",
            },
            "& .MuiCheckbox-root": {
              color: "var(--checkbox-primary)",
            },
          }}
        />
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={handleCleanStepBack}
          variant="outlined"
          color="primary"
          disabled={cleanStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (cleanStep < cleaningSteps.length - 1) {
              handleCleanStepNext(); // Move to the next step
            } else {
              completeCurrentStep();
              alert("Data cleaned successfully! Click the check button to proceed!");
            }
          }}
          variant="contained"
          color="primary"
          disabled={!isCurrentCleanStepComplete} // Disable unless the action for this step is complete
        >
          {cleanStep === cleaningSteps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default CleanPage;
