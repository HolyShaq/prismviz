"use client";

import React, { useContext, useState } from "react";
import Papa from "papaparse";
import { Box, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";

interface UploadPageProps {
  onComplete: () => void;
  setCurrentStep: (step: number) => void;
  setCompletedSteps: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const UploadPage: React.FC<UploadPageProps> = ({
  onComplete,
  setCurrentStep,
  setCompletedSteps,
}) => {
  const { csvFile, setCsvFile, csvData, handleFileLoaded, clearFile } =
    useContext(CsvContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<Record<string, unknown>[]>(
    [],
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: Record<string, unknown>[] }) => {
          //handleFileLoaded(file, results.data);
          setFile(file);
          setUploadedData(results.data);
          setIsModalOpen(true);
        },
      });
    }
  };

  const handleFileLoad = () => {
    if (file && uploadedData) {
      handleFileLoaded(file, uploadedData);
      setIsModalOpen(false);
      onComplete();
    }
  };

  // Get columns of csvData or uploadedData depending on which is available
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
