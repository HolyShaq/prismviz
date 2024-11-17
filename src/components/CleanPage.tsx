"use client";

import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";

const CleanPage: React.FC = () => {
  const { csvData } = useContext(CsvContext);
  const { completeCurrentStep, handleBack } = useStepContext();

  if (csvData.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: "center",
          mt: 4,
          color: "var(--neutral-black-100)",
        }}
      >
        No data available
      </Typography>
    );
  }

  const columns: GridColDef[] = Object.keys(csvData[0]).map((key) => ({
    field: key,
    headerName: key,
    flex: 1, // Makes columns responsive
    minWidth: 150, // Minimum width for columns to prevent overlapping
  }));

  const rows = csvData.map((row, index) => ({ id: index, ...row }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Full screen height
        backgroundColor: "var(--neutral-white-10)",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--neutral-white-20)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6">Data Cleaning Step</Typography>
        <Box display="flex" gap={2}>
          <Button
            onClick={handleBack}
            variant="outlined"
            color="primary"
            sx={{
              color: "var(--neutral-black-100)",
              borderColor: "var(--neutral-black-100)",
              "&:hover": { borderColor: "var(--primary-main)" },
            }}
          >
            Back to Upload
          </Button>
          <Button
            onClick={completeCurrentStep}
            variant="contained"
            sx={{
              backgroundColor: "var(--button-primary)",
              color: "var(--neutral-white-10)",
              "&:hover": { backgroundColor: "var(--button-primary-hover)" },
            }}
          >
            Clean Data
          </Button>
        </Box>
      </Box>

      {/* DataGrid Section */}
      <Box
        sx={{
          flexGrow: 1, // Makes the DataGrid take up remaining space
          overflow: "auto", // Adds scrolling for the DataGrid
          p: 2,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-root": {
              color: "var(--neutral-black-100)",
              backgroundColor: "var(--neutral-white-10)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--neutral-white-20)",
              color: "var(--neutral-black-100)",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              color: "var(--neutral-black-100)",
            },
            "& .MuiCheckbox-root": {
              color: "var(--checkbox-primary)",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CleanPage;
