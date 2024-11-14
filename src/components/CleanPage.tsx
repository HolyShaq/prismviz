"use client";

import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";

interface CleanPageProps {
  onBack: () => void;
  onComplete: () => void;
  setCleanedData: (data: any[]) => void;
}

const CleanPage: React.FC<CleanPageProps> = ({ onBack, onComplete, setCleanedData }) => {
  const { csvData } = useContext(CsvContext);

  if (csvData.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const columns: GridColDef[] = Object.keys(csvData[0]).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
    minWidth: 100,
  }));

  const rows = csvData.map((row, index) => ({ id: index, ...row }));

  const handleCleanData = () => {
    const cleanedData = csvData.map((row) => ({ ...row, cleaned: true })); // Example cleaning transformation
    console.log("Cleaned Data:", cleanedData); // Debugging output
    setCleanedData(cleanedData); // Pass cleaned data to the next step
    onComplete(); // Mark step 2 as complete and automatically move to step 3
  };
  

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Data Cleaning Step
      </Typography>
      <Button onClick={onBack} variant="outlined" color="primary" sx={{ mb: 2 }}>
        Back to Upload
      </Button>
      <Button
        onClick={handleCleanData}
        variant="contained"
        color="secondary"
        sx={{ mb: 2, ml: 2 }}
      >
        Clean Data
      </Button>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default CleanPage;
