import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";

const CleanPage: React.FC = () => {
  const { csvData } = useContext(CsvContext); // Access CSV data

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
    flex: 1,
    minWidth: 150,
    // editable: true,
  }));

  const rows = csvData.map((row, index) => ({ id: index, ...row }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Full screen height
        maxHeight: "100%",
        backgroundColor: "var(--neutral-white-10)",
      }}
    >
      {/* Ribbon */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "var(--neutral-white-20)",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      ></Box>

      {/* DataGrid */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: "var(--neutral-white-10)",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-root": {
              color: "var(--neutral-black-50)",
              backgroundColor: "var(--neutral-white-30)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--neutral-white-30)",
              color: "var(--neutral-black-100)",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              color: "var(--neutral-black-50)",
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
