"use client";

import React, { createContext, useState, ReactNode } from "react";
import { useStepContext } from "./StepContext";

type CsvContextType = {
  csvFile: File | null;
  csvData: Record<string, unknown>[]; // Data loaded from CSV
  setCsvFile: (file: File | null) => void;
  setCsvData: (data: Record<string, unknown>[]) => void;
  handleFileLoaded: (file: File, data: Record<string, unknown>[]) => void;
  clearFile: () => void;
};

export const CsvContext = createContext<CsvContextType>({
  csvFile: null,
  csvData: [],
  setCsvFile: () => { },
  setCsvData: () => { },
  handleFileLoaded: () => { },
  clearFile: () => { },
});

// Provider
export const CsvContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);

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
        setCsvFile,
        setCsvData,
        handleFileLoaded,
        clearFile,
      }}
    >
      {children}
    </CsvContext.Provider>
  );
};
