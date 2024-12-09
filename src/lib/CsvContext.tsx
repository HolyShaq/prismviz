"use client";

import React, { createContext, useState, ReactNode } from "react";
import { useStepContext } from "./StepContext";
import { GridRowId } from "@mui/x-data-grid";

type CsvContextType = {
  csvFile: File | null;
  csvData: Record<string, unknown>[]; // Data loaded from CSV
  selectedRowIds: Set<GridRowId>;
  setCsvFile: (file: File | null) => void;
  setCsvData: (data: Record<string, unknown>[]) => void;
  setSelectedRowIds: (selectedRowIds: Set<GridRowId>) => void;
  handleFileLoaded: (file: File, data: Record<string, unknown>[]) => void;
  deleteSelectedRows: () => void;
  clearFile: () => void;
};

export const CsvContext = createContext<CsvContextType>({
  csvFile: null,
  csvData: [],
  selectedRowIds: new Set(),
  setCsvFile: () => {},
  setCsvData: () => {},
  setSelectedRowIds: () => {},
  handleFileLoaded: () => {},
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

  const { setCleanStep, setCleanStepCompleted } = useStepContext();

  // Handle file load
  const handleFileLoaded = (file: File, data: Record<string, unknown>[]) => {
    setCsvFile(file);
    setCsvData(data);
    resetCleaningSteps();
  };

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
        csvData,
        selectedRowIds,
        setCsvFile,
        setCsvData,
        setSelectedRowIds,
        handleFileLoaded,
        deleteSelectedRows,
        clearFile,
      }}
    >
      {children}
    </CsvContext.Provider>
  );
};
