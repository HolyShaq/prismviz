"use client";

import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";

interface CleanPageProps {
  onComplete: () => void;
  setCurrentStep: (step: number) => void;
}

const CleanPage: React.FC<CleanPageProps> = ({ onComplete, setCurrentStep }) => {
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
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ pageSize: 10, page: 0 });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Data Cleaning Step
      </Typography>
      <Button onClick={() => setCurrentStep(0)} variant="outlined" color="primary" sx={{ mb: 2 }}>
        Back to Upload
      </Button>
      <Button onClick={onComplete} variant="contained" color="secondary" sx={{ mb: 2, ml: 2 }}>
        Clean Data
      </Button>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pagination pageSizeOptions={[5, 10, 20]} checkboxSelection />
      </Box>
    </Box>
  );
};

export default CleanPage;
