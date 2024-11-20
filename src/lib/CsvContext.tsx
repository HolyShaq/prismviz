"use client";

import React, { createContext, useState, ReactNode } from "react";
import _ from "lodash";

type CsvContextType = {
  csvFile: File | null;
  csvData: Record<string, unknown>[]; // Data loaded from CSV
  setCsvFile: (file: File | null) => void;
  setCsvData: (data: Record<string, unknown>[]) => void;
  handleFileLoaded: (file: File, data: Record<string, unknown>[]) => void;
  clearFile: () => void;

  // Cleaning methods (dummy initializations)
  handleMissingData: () => void;
  removeDuplicates: () => void;
  validateColumns: () => void;
};

export const CsvContext = createContext<CsvContextType>({
  csvFile: null,
  csvData: [],
  setCsvFile: () => { },
  setCsvData: () => { },
  handleFileLoaded: () => { },
  clearFile: () => { },

  handleMissingData: () => { },
  removeDuplicates: () => { },
  validateColumns: () => { },
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

  /* Data cleaning methods */

  // Handle missing data
  const handleMissingData = () => {
    const cleanedData = csvData.map((row) =>
      _.mapValues(row, (value) => (value === null || value === "" ? "N/A" : value))
    );
    setCsvData(cleanedData);
    alert(`Cleaned data preview: ${JSON.stringify(cleanedData.slice(0, 3))}`);
  };

  // Remove duplicate rows
  const removeDuplicates = () => {
    const uniqueData = _.uniqWith(csvData, _.isEqual);
    setCsvData(uniqueData);
    alert(`Unique data preview: ${JSON.stringify(uniqueData.slice(0, 3))}`);
  };

  // Validate column entries
  const validateColumns = () => {
    const validatedData = csvData.map((row) =>
      _.mapValues(row, (value) =>
        typeof value === "string" && !isNaN(parseFloat(value)) ? parseFloat(value) : value
      )
    );
    setCsvData(validatedData);
    alert(`Validated data preview: ${JSON.stringify(validatedData.slice(0, 3))}`);
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
        handleMissingData,
        removeDuplicates,
        validateColumns,
      }}
    >
      {children}
    </CsvContext.Provider>
  );
};
