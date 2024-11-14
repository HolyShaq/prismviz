"use client";

import React, { useRef, useState, useContext } from "react";
import Papa from "papaparse";
import { Box, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";

const UploadPage: React.FC<{
  onComplete: () => void;
  goToDataCleaningStep: () => void;
  resetSteps: () => void;
}> = ({ onComplete, goToDataCleaningStep, resetSteps }) => {
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
        handleFileLoaded(file, results.data);
        setIsModalOpen(true);
      },
    });
  };

  const clearFileHandler = () => {
    clearFile();
    resetSteps(); // Reset the steps and state
  };

  return (
    <div>
      <p>Upload CSV File</p>
      {csvFile ? (
        <div>
          <p>File uploaded: {csvFile.name}</p>
          <Button onClick={clearFileHandler} variant="outlined" color="secondary">
            Clear File
          </Button>
        </div>
      ) : (
        <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} />
      )}

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
              rows={csvData.map((row, index) => ({ id: index, ...row }))}
              columns={Object.keys(csvData[0] || {}).map((key) => ({
                field: key,
                headerName: key,
                flex: 1,
                minWidth: 100,
              }))}
            />
          </Box>
          <Button onClick={goToDataCleaningStep} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Proceed
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadPage;
