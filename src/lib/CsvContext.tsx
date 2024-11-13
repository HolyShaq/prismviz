"use client";

import React, { createContext, useState, ReactNode } from "react";

type CsvContextType = {
  csvFile: File | null;
  csvData: Record<string, unknown>[];
  setCsvFile: (file: File | null) => void;
  setCsvData: (data: Record<string, unknown>[]) => void;
  handleFileLoaded: (file: File, data: Record<string, unknown>[]) => void;
  clearFile: () => void;
};

export const CsvContext = createContext<CsvContextType>({
  csvFile: null,
  csvData: [],
  setCsvFile: () => {},
  setCsvData: () => {},
  handleFileLoaded: () => {},
  clearFile: () => {},
});

export const CsvContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);

  // Handle loading a CSV file and its parsed data
  const handleFileLoaded = (file: File, data: Record<string, unknown>[]) => {
    setCsvFile(file);
    setCsvData(data);
  };

  // Clear the uploaded file and data
  const clearFile = () => {
    setCsvFile(null);
    setCsvData([]);
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
