"use client";

import React, { useContext, useState } from "react";
import Papa from "papaparse";
import { Box, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";
import UploadFileIcon from "@mui/icons-material/UploadFile"; // Import an upload icon

const UploadPage: React.FC = () => {
  const { csvFile, csvData, handleFileLoaded } = useContext(CsvContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<Record<string, unknown>[]>(
    []
  );
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

  const handleFileLoad = () => {
    if (file && uploadedData.length > 0) {
      handleFileLoaded(file, uploadedData);
      setIsModalOpen(false); // Close the modal
    }
  };

  // Dynamically generate columns for the table preview
  const columns: GridColDef[] = csvData.length
    ? Object.keys(csvData[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 150,
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
    <div className="flex flex-col h-full w-full bg-primary-main text-neutral-white10">
      {csvFile ? (
        <div className="flex-grow w-full overflow-auto bg-primary-main p-4 rounded-lg shadow-md">
          <DataGrid
            className="w-full h-full"
            rows={csvData.map((row, index) => ({ id: index, ...row }))}
            columns={columns}
            sx={{
              "& .MuiDataGrid-root": {
                color: "var(--neutral-white-30)",
                backgroundColor: "var(--primary-main)",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--primary-hover)",
                color: "var(--neutral-black-50)",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                color: "var(--neutral-white-30)",
              },
              "& .MuiCheckbox-root": {
                color: "var(--checkbox-primary)",
              },
              "& .MuiTablePagination-root": {
                color: "var(--neutral-white-30)",
              },
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div
            className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg"
            style={{
              background: "var(--primary-surface)",
              width: "350px",
              textAlign: "center",
              border: "1px solid #ddd",
            }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center justify-center bg-white text-primary-main py-6 px-8 rounded-lg text-lg font-semibold hover:opacity-90 shadow-lg"
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ddd",
                backgroundColor: "var(--neutral-white-20)",
              }}
            >
              <UploadFileIcon
                sx={{
                  fontSize: "var(--font-size-h1)",
                  color: "var(--neutral-white-30)",
                  marginBottom: "10px",
                }}
              />
              Upload a CSV File
            </label>
            <div
              style={{
                borderTop: "1px solid #ddd",
                marginTop: "10px",
                paddingTop: "10px",
                color: "#555",
                fontSize: "var(--font-size-p2)",
              }}
            >
              25 MB Max. file size, [Column Name] is required.
            </div>
          </div>
        </div>
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
            onClick={handleFileLoad}
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
