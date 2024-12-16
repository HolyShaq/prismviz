"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useStepContext } from "./StepContext";
import { GridRowId } from "@mui/x-data-grid";
import Papa from "papaparse";
import { Box, Button, Modal, Typography, styled, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useChartContext } from "./ChartContext";

type CsvContextType = {
  csvFile: File | null;
  uploadedData: Record<string, unknown>[];
  columns: GridColDef[];
  csvData: Record<string, unknown>[]; // Data loaded from CSV
  selectedRowIds: Set<GridRowId>;
  setCsvFile: (file: File | null) => void;
  setCsvData: (data: Record<string, unknown>[]) => void;
  setSelectedRowIds: (selectedRowIds: Set<GridRowId>) => void;
  handleFileLoaded: (file: File, data: Record<string, unknown>[]) => void;
  deleteSelectedRows: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
};

export const CsvContext = createContext<CsvContextType>({
  csvFile: null,
  uploadedData: [],
  columns: [],
  csvData: [],
  selectedRowIds: new Set(),
  setCsvFile: () => {},
  setCsvData: () => {},
  setSelectedRowIds: () => {},
  handleFileLoaded: () => {},
  handleFileUpload: () => {},
  deleteSelectedRows: () => {},
  clearFile: () => {},
});

const StyledGridOverlay = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
}));

function CircularProgressWithLabel({
  value,
}: {
  value: number;
}) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" value={value} />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.primary"
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const CustomLoadingOverlay = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <StyledGridOverlay>
      <CircularProgressWithLabel value={progress} />
      <Box sx={{ mt: 2 }}>Loading rows…</Box>
    </StyledGridOverlay>
  );
};

// Provider
export const CsvContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<GridRowId>>(
    new Set(),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<Record<string, unknown>[]>(
    [],
  );

  const [loading, setLoading] = useState(false); // Track loading state
  
  const {
    setCurrentStep,
    setCompletedSteps,
    setCleanStep,
    setCleanStepCompleted,
  } = useStepContext();
  const { clearFigures } = useChartContext();

  const handleFileLoad = () => {
    if (file && uploadedData.length > 0) {
      clearFile(); // Clears file data from CsvContext
      setCompletedSteps([false, false, false]); // Resets all step completions
      setCurrentStep(0);
      clearFigures();
      handleFileLoaded(file, uploadedData);
      setIsModalOpen(false); // Close the modal
    }
  };

  const handleFileLoaded = (file: File, data: Record<string, unknown>[]) => {
    setCsvFile(file);
    setCsvData(data);
    resetCleaningSteps();
  };

  // Normalize CSV data: convert empty strings to null
  const normalizeCsvData = (data: Record<string, unknown>[]) => {
    return data.map((row) => {
      const normalizedRow: Record<string, unknown> = {};

      Object.keys(row).forEach((key) => {
        // If the value is an empty string, replace it with null
        if (row[key] === "") {
          normalizedRow[key] = null;
        } else {
          normalizedRow[key] = row[key];
        }
      });

      return normalizedRow;
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert("File size limit exceeded. Please choose a smaller file.");
        return;
      }
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: Record<string, unknown>[] }) => {
          const normalizedData = normalizeCsvData(results.data);
  
          // Automatically open modal and start loading rows
          setFile(file);
          setUploadedData(normalizedData); // Parsed data
          setIsModalOpen(true); // Open the modal
          setLoading(true); // Start loading state
  
          // Simulate row loading progress
          let localProgress = 0; // Use only a local variable
          const interval = setInterval(() => {
            localProgress += 10;
            if (localProgress >= 100) {
              clearInterval(interval);
              setLoading(false); // Stop loading
              setCsvData(normalizedData); // Transfer uploaded data to CSV data
            }
          }, 200); // Adjust interval for loading simulation
        },
      });
    }
  };

  // Dynamically generate columns for the table preview
  const columns: GridColDef[] =
    csvData.length > 0
      ? Object.keys(csvData[0]).map((key) => ({
          field: key,
          headerName: key,
          flex: 1,
          minWidth: 150,
        }))
      : [];

  const columnsUpload: GridColDef[] = uploadedData.length
    ? Object.keys(uploadedData[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 100,
      }))
    : [];

  // Clear file data
  const clearFile = () => {
    setCsvFile(null);
    setCsvData([]);
    resetCleaningSteps();
  };

  const deleteSelectedRows = () => {
    const updatedData = csvData.filter(
      (_row, index) => !selectedRowIds.has(index),
    );
    setSelectedRowIds(new Set());
    setCsvData(updatedData);
  };

  // Reset cleaning steps
  const resetCleaningSteps = () => {
    setCleanStep(0);
    setCleanStepCompleted([false, false, false]);
  };

  return (
    <CsvContext.Provider
      value={{
        csvFile,
        uploadedData,
        columns,
        csvData,
        selectedRowIds,
        setCsvFile,
        setCsvData,
        setSelectedRowIds,
        handleFileLoaded,
        handleFileUpload,
        deleteSelectedRows,
        clearFile,
      }}
    >
      {children}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            CSV File Preview
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={uploadedData.map((row, index) => ({
              id: index,
              ...row,
            }))}
            columns={columnsUpload}
            loading={loading} // Display loading overlay if rows are still loading
            slots={{
              loadingOverlay: CustomLoadingOverlay, // Custom overlay during loading
            }}
          />
          </Box>
          <Button
            onClick={handleFileLoad}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Loading..." : "Load"}
          </Button>
        </Box>
      </Modal>
    </CsvContext.Provider>
  );
};
