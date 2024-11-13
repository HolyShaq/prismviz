"use client";

import React, { useRef, useState, useContext } from "react";
import Papa from "papaparse";
import {
  Box,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";

const UploadPage: React.FC<{ onComplete: () => void; goToDataCleaningStep: () => void }> = ({
  onComplete,
  goToDataCleaningStep,
}) => {
  const { csvFile, setCsvFile, csvData, handleFileLoaded, clearFile } = useContext(CsvContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCsvFile(file);
      setCsvFile(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const parseCsvFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: Record<string, unknown>[] }) => {
        handleFileLoaded(file, results.data); // Set CSV file and data in context
        setIsModalOpen(true); // Open modal with preview
      },
    });
  };

  const loadFileAndProceed = () => {
    setIsModalOpen(false); // Close modal
    goToDataCleaningStep(); // Move to data cleaning step
    onComplete(); // Mark this step as complete
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = csvData.length
    ? Object.keys(csvData[0]).map((key) => ({
      field: key,
      headerName: key,
      flex: 1,
      minWidth: 100,
    }))
    : [];

  return (
    <div>
      <p>Upload CSV File</p>
      {csvFile ? (
        <div>
          <p>File uploaded: {csvFile.name}</p>
          <Button onClick={clearFile} variant="outlined" color="secondary">
            Clear File
          </Button>
        </div>
      ) : (
        <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            CSV File Preview
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid rows={csvData.map((row, index) => ({ id: index, ...row }))} columns={columns} />
          </Box>
          <Button onClick={loadFileAndProceed} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Load
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadPage;
