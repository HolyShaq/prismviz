"use client";

import React, { useContext, useState } from "react";
import Papa from "papaparse";
import { Box, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";

const UploadPage: React.FC = () => {
  const { csvFile, setCsvFile, csvData, handleFileLoaded, clearFile } =
    useContext(CsvContext);
  const { completeCurrentStep, setCurrentStep, setCompletedSteps } = useStepContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<Record<string, unknown>[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: Record<string, unknown>[] }) => {
          setFile(file);
          setUploadedData(results.data);
          setIsModalOpen(true); // Open preview modal
        },
      });
    }
  };

  const handleFileLoad = () => {
    if (file && uploadedData.length > 0) {
      handleFileLoaded(file, uploadedData);
      setIsModalOpen(false); // Close the modal
      completeCurrentStep(); // Mark this step as complete
    }
  };

  // Dynamically generate columns for the table preview
  const columns: GridColDef[] = csvData.length
    ? Object.keys(csvData[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 100,
      }))
    : uploadedData.length
    ? Object.keys(uploadedData[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 100,
      }))
    : [];

  return (
    <div className="max-h-full max-w-full pb-28 pr-11">
      {csvFile ? (
        <div className="w-full h-full max-w-full max-h-full">
          <DataGrid
            className="max-w-full"
            rows={csvData.map((row, index) => ({ id: index, ...row }))}
            columns={columns}
          />
        </div>
      ) : (
        <input type="file" accept=".csv" onChange={handleFileUpload} />
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
              rows={uploadedData.map((row, index) => ({
                id: index,
                ...row,
              }))}
              columns={columns}
            />
          </Box>
          <Button
            onClick={() => handleFileLoad()}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Load
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadPage;
