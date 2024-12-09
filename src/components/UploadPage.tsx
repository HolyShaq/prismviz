"use client";

import React, { useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CsvContext } from "../lib/CsvContext";
import UploadFileIcon from "@mui/icons-material/UploadFile"; // Import an upload icon

const UploadPage: React.FC = () => {
  const { csvFile, csvData, columns, handleFileUpload } =
    useContext(CsvContext);

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
              10 MB max file size
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
