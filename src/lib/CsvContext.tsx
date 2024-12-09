"use client";

import React, { createContext, useState, ReactNode } from "react";
import { useStepContext } from "./StepContext";
import { GridRowId } from "@mui/x-data-grid";
import Papa from "papaparse";
import { Box, Button, Modal, Typography } from "@mui/material";
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
      // Limit file size under 10mb
      if (file.size > 10 * 1024 * 1024) {
        alert("File size limit exceeded. Please choose a smaller file.");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: Record<string, unknown>[] }) => {
          // Normalize the CSV data before setting it
          const normalizedData = normalizeCsvData(results.data);

          // Set the file and normalized data
          setFile(file);
          setUploadedData(normalizedData);
          setIsModalOpen(true); // Open preview modal
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
            />
          </Box>
          <Button
            onClick={handleFileLoad}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Load
          </Button>
        </Box>
      </Modal>
    </CsvContext.Provider>
  );
};
