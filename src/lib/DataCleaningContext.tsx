import React, { createContext, useContext, ReactNode, useState } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { CsvContext } from "./CsvContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { determineValueType } from "./utils";
import SnackNotif from "@/components/SnackbarNotif";

// Type for the methods in our DataCleaningContext
type DataCleaningContextType = {
  handleMissingData: () => void;
  removeDuplicates: () => void;
  validateColumns: () => void;
};
type RowData = Record<string, unknown>;

// Type for the severity strings
type Severity = "success" | "info" | "warning" | "error";

export const DataCleaningContext = createContext<DataCleaningContextType>({
  handleMissingData: () => {},
  removeDuplicates: () => {},
  validateColumns: () => {},
});

export const DataCleaningProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { csvData, setCsvData } = useContext(CsvContext);

  const [openModal, setOpenModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false); // State for preview modal
  const [missingDataOption, setMissingDataOption] = useState<string>("");
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]); // For holding the preview data
  const [openRemovePreviewModal, setOpenRemovePreviewModal] = useState(false); // Modal for row removal preview
  const [rowsWithMissingData, setRowsWithMissingData] = useState<
    Record<string, unknown>[]
  >([]);

  const [removedDuplicates, setRemovedDuplicates] = useState<
    Record<string, unknown>[]
  >([]);
  const [openRemovedDuplicatesModal, setOpenRemovedDuplicatesModal] =
    useState(false);

  const [validatedChanges, setValidatedChanges] = useState<RowData[]>([]);
  const [openValidationModal, setOpenValidationModal] =
    useState<boolean>(false);

  // Snackbar stuff
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Severity>("success");

  const showSnackNotif: (message: string, severity: Severity) => void = (
    message,
    severity,
  ) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  /* Step 1 functions for handling missing data */

  const findRowsWithMissingData = () => {
    const rowsToRemove = csvData.filter((row) => {
      // Count the number of missing (null) values in the row
      return Object.values(row).some((value) => value === null);
    });

    setRowsWithMissingData(rowsToRemove);
  };

  const findColsWithMissingData = () => {
    const flaggedCols: string[] = [];
    Object.keys(csvData[0]).forEach((col) => {
      const missingCount = csvData.filter((row) => row[col] === null).length;
      if (missingCount > 2) {
        flaggedCols.push(col);
      }
    });
    return flaggedCols;
  };

  const removeRowsWithMissingData = () => {
    const filteredData = csvData.filter((row) => {
      return !Object.values(row).some((value) => value === null);
    });

    setCsvData(filteredData);
    setRowsWithMissingData([]); // Clear the rows with missing data after removal
    setOpenRemovePreviewModal(false); // Close remove preview modal
    setOpenModal(false); // Close the original preview modal
  };

  const handleRemoveRowsWithMissingData = () => {
    findRowsWithMissingData();
    setOpenRemovePreviewModal(true); // Open the new modal to confirm row removal
  };

  const RemoveRowsPreviewModal = () => {
    return (
      <Dialog
        open={openRemovePreviewModal}
        onClose={() => setOpenRemovePreviewModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Rows to be Removed</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            The following rows contain missing data:
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            {rowsWithMissingData.length > 0 ? (
              <Box>
                <Typography variant="body2" style={{ color: "red" }}>
                  The following rows will be removed:
                </Typography>
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <DataGrid
                    rows={rowsWithMissingData.map((row, index) => ({
                      id: index,
                      ...row,
                    }))}
                    columns={Object.keys(rowsWithMissingData[0] || {}).map(
                      (column) => ({
                        field: column,
                        headerName: column,
                        width: 200,
                      }),
                    )}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" style={{ color: "green" }}>
                No rows to remove (no missing data found).
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRemovePreviewModal(false)}
            color="primary"
          >
            Cancel
          </Button>
          {/* Show the "Confirm Removal" button only if there are rows to remove */}
          {rowsWithMissingData.length > 0 && (
            <Button
              onClick={() => {
                showSnackNotif(
                  `${rowsWithMissingData.length} rows removed.`,
                  "success",
                );
                removeRowsWithMissingData();
              }}
              color="primary"
            >
              Confirm Removal
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  // Mode Imputation (replaces nulls with the most frequent value)
  const applyModeImputation = () => {
    // Deep copy csvData
    let processedData: Record<string, unknown>[] = JSON.parse(
      JSON.stringify(csvData),
    );

    const flaggedCols = findColsWithMissingData();

    const modes = flaggedCols.map((col) => {
      const counts: { [key: string]: number } = {};
      processedData.forEach((row) => {
        if (row[col] !== null) {
          counts[String(row[col])] = (counts[String(row[col])] || 0) + 1;
        }
      });
      const maxCount = Math.max(...Object.values(counts));
      return Object.keys(counts).find((key) => counts[key] === maxCount);
    });

    processedData = processedData.map((row) => {
      flaggedCols.forEach((col, index) => {
        if (row[col] === null) {
          row[col] = modes[index];
        }
      });
      return row;
    });

    // Set the preview data to show the difference
    setPreviewData(processedData);
    setOpenPreviewModal(true); // Open preview modal
    setOpenModal(false); // Close the original modal
  };

  // Preview Modal for showing the changes
  const PreviewChangesModal = () => {
    // Ensure csvData and previewData are not empty or undefined before attempting to use them
    if (!csvData || csvData.length === 0) {
      return (
        <Dialog
          open={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Preview Changes</DialogTitle>
          <DialogContent>
            <Typography variant="h6">No data available for preview.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreviewModal(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    // Filter rows where the data has changed
    const changedRows = previewData
      .map((row, rowIndex) => {
        if (!csvData[rowIndex]) return null; // Skip rows that don't exist in the original data

        const originalRow = csvData[rowIndex];
        const updatedRow: Record<string, unknown> = { id: rowIndex }; // Initialize row with id for the DataGrid
        let isRowChanged = false; // Flag to track if any value has changed

        Object.keys(row).forEach((column) => {
          const originalValue = originalRow[column];
          const updatedValue = row[column];

          // If the value has changed, we mark the column with the updated value
          if (originalValue !== updatedValue) {
            updatedRow[column] = updatedValue;
            isRowChanged = true; // Mark the row as changed
          } else {
            // If unchanged, include the original value (no special styling needed)
            updatedRow[column] = originalValue;
          }
        });

        // Only return the row if it has changed
        return isRowChanged ? updatedRow : null;
      })
      .filter((row) => row !== null); // Remove rows that haven't changed

    // Prepare columns for DataGrid
    const columns: GridColDef[] = Object.keys(csvData[0]).map((column) => ({
      field: column,
      headerName: column,
      width: 200,
      renderCell: (params: GridCellParams) => {
        const originalValue = csvData[params.row.id][params.field]; // Original value
        const updatedValue = params.value; // Updated value

        // Ensure values are strings to avoid 'unknown' error
        const originalStr = String(originalValue);
        const updatedStr = String(updatedValue);

        // Check if the current cell value has changed
        const isUpdated = originalStr !== updatedStr;

        // Only show strikethrough for changed values
        return (
          <Box>
            {isUpdated ? (
              <>
                {/* Show original value with red strikethrough */}
                <Typography
                  variant="body2"
                  style={{ color: "red", textDecoration: "line-through" }}
                >
                  {originalStr}
                </Typography>
                {/* Show updated value in green */}
                <Typography variant="body2" style={{ color: "green" }}>
                  {updatedStr}
                </Typography>
              </>
            ) : (
              // If no change, just display the original value in black text
              <Typography variant="body2">{originalStr}</Typography>
            )}
          </Box>
        );
      },
    }));

    return (
      <Dialog
        open={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Preview Changes</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Preview of Changes:</Typography>
          <Box sx={{ marginTop: 2, height: 400 }}>
            <DataGrid
              rows={changedRows} // Only pass rows that have changes
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 100 } },
              }}
              pageSizeOptions={[100]}
              disableRowSelectionOnClick
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewModal(false)} color="primary">
            Close
          </Button>
          {/* Only show the "Apply Changes" button if there are rows with changes */}
          {changedRows.length > 0 && (
            <Button
              onClick={() => {
                // Show snack notif of rows affected
                showSnackNotif(
                  `${changedRows.length} row(s) updated.`,
                  "success",
                );
                applyChanges();
              }}
              color="primary"
            >
              Apply Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  // Apply the changes after preview (e.g., save the changes to the state)
  const applyChanges = () => {
    setCsvData(previewData); // Apply the previewed changes
    setOpenPreviewModal(false); // Close preview modal
  };

  // Handle missing data modal
  const handleMissingData = () => {
    setOpenModal(true); // Open the main modal
  };

  // Function to process missing data based on selected method
  const processMissingData = () => {
    switch (missingDataOption) {
      case "modeImputation":
        applyModeImputation(); // Apply mode imputation
        break;
      case "removeRows":
        handleRemoveRowsWithMissingData();
      default:
        break;
    }
  };

  /* Step 2 functions for removing duplicates */

  // Function to remove duplicates and open modal
  const removeDuplicates = () => {
    // Step 1: Detect duplicates and show modal
    detectDuplicates();
  };

  // Function to detect duplicates and open the modal
  const detectDuplicates = () => {
    const seen = new Map<string, RowData>(); // Use Map to track unique rows
    const duplicates: RowData[] = []; // Explicitly define the type of 'duplicates'

    csvData.forEach((row) => {
      const rowKey = JSON.stringify(row); // Serialize row for comparison
      if (seen.has(rowKey)) {
        duplicates.push(row); // It's a duplicate
      } else {
        seen.set(rowKey, row); // Mark it as seen
      }
    });

    // Log for debugging
    console.log("Detected duplicates:", duplicates);

    // Update state to store duplicates
    setRemovedDuplicates(duplicates); // Preview the duplicates
    setOpenRemovedDuplicatesModal(true); // Open modal for preview
  };

  // Modal component to show removed duplicates
  const RemovedDuplicatesModal = () => {
    if (!removedDuplicates || removedDuplicates.length === 0) {
      return (
        <Dialog
          open={openRemovedDuplicatesModal}
          onClose={() => setOpenRemovedDuplicatesModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Removed Duplicates</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              No duplicates found to display.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenRemovedDuplicatesModal(false)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    // Add a unique id to each row for DataGrid
    const rowsWithIds = removedDuplicates.map((row, index) => ({
      ...row, // Copy the row's data
      id: index, // Add a unique 'id' based on the index (or use another strategy like serialized row data)
    }));

    return (
      <Dialog
        open={openRemovedDuplicatesModal}
        onClose={() => setOpenRemovedDuplicatesModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Removed Duplicates</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            The following rows are duplicates:
          </Typography>
          <Box sx={{ marginTop: 2, height: 400 }}>
            <DataGrid
              rows={rowsWithIds} // Pass the rows with 'id' property
              columns={Object.keys(csvData[0] || {}).map((column) => ({
                field: column,
                headerName: column,
                width: 200,
              }))}
              initialState={{
                pagination: { paginationModel: { pageSize: 100 } },
              }}
              pageSizeOptions={[100]}
              disableRowSelectionOnClick
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRemovedDuplicatesModal(false)}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              showSnackNotif(
                `${removedDuplicates.length} duplicate(s) removed.`,
                "success",
              );
              applyRemovedDuplicates();
            }}
            color="primary"
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Function to apply removed duplicates
  const applyRemovedDuplicates = () => {
    // Remove duplicates by creating a new array with unique rows
    const uniqueData = Array.from(
      new Map(csvData.map((row) => [JSON.stringify(row), row])).values(),
    );
    setCsvData(uniqueData); // Update csvData
    setOpenRemovedDuplicatesModal(false); // Close modal after applying
  };

  /* Step 3 functions for validating columns */

  // Function to validate columns and track changes
  const validateColumns = () => {
    const dataCopy = JSON.parse(JSON.stringify(csvData));
    const changes: RowData[] = []; // Array to store changes for tracking

    // Titlecase all string columns
    function toTitleCase(str: string) {
      return str.replace(
        /\w\S*/g,
        (text) =>
          text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
      );
    }
    const stringColumns = Object.keys(csvData[0]).filter(
      (key) => determineValueType(String(csvData[0][key])) === "string",
    );

    const titlecaseData = dataCopy.map(
      (row: Record<string, unknown>, index: number) => {
        stringColumns.forEach((col) => {
          const value = String(row[col]);

          // Check if the value is an email by looking for '@'
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

          if (!isEmail && value !== toTitleCase(value)) {
            const originalValue = value;
            row[col] = toTitleCase(value);
            changes.push({
              "Row Index": index,
              "Column Name": col,
              "Original Value": originalValue,
              "Converted Value": row[col],
            });
          }
        });
        return row;
      },
    );

    // Step 2: Update state with validated data and changes
    setCsvData(titlecaseData);
    setValidatedChanges(
      changes.map((change, index) => ({ id: index, ...change })),
    ); // Store the changes
    setOpenValidationModal(true); // Open the modal to show the changes
  };

  // Modal to show what was changed during validation
  const ValidationChangesModal = () => {
    if (validatedChanges.length === 0) {
      return (
        <Dialog
          open={openValidationModal}
          onClose={() => setOpenValidationModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Validation Changes</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              No changes were made during validation.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenValidationModal(false)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    // Prepare columns dynamically based on the column names of the data
    const columns: GridColDef[] = Object.keys(validatedChanges[0]).map(
      (column) => ({
        field: column,
        headerName: column, // Display the actual column name in the header
        width: 200,
        renderCell: (params: GridCellParams) => {
          if (params.colDef.field !== "Converted Value") {
            return (
              <Typography variant="body2">{String(params.value)}</Typography>
            );
          }
          return (
            <Box>
              <>
                {/* Show original value with red strikethrough */}
                <Typography
                  variant="body2"
                  style={{ color: "red", textDecoration: "line-through" }}
                >
                  {String(params.row["Original Value"])}
                </Typography>
                {/* Show updated value in green */}
                <Typography variant="body2" style={{ color: "green" }}>
                  {String(params.row["Converted Value"])}
                </Typography>
              </>
            </Box>
          );
        },
      }),
    );

    return (
      <Dialog
        open={openValidationModal}
        onClose={() => setOpenValidationModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Validation Changes</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            The following changes were made during validation:
          </Typography>
          <Box sx={{ marginTop: 2, height: 400 }}>
            <DataGrid
              rows={validatedChanges} // Display changes in the modal
              columns={columns.filter(
                (col) => col.field !== "Original Value" && col.field !== "id",
              )} // Dynamically generated columns based on actual data columns
              getRowId={(row) => row.id} // Specify the unique 'id' field
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              showSnackNotif(
                `${validatedChanges.length} cells standardized.`,
                "success",
              );
              setOpenValidationModal(false);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <DataCleaningContext.Provider
      value={{
        handleMissingData,
        removeDuplicates,
        validateColumns,
      }}
    >
      {children}

      {/* Main Modal for missing data options */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Handle Missing Data</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose an option:</FormLabel>
            <RadioGroup
              value={missingDataOption}
              onChange={(e) => setMissingDataOption(e.target.value)}
            >
              <FormControlLabel
                value="modeImputation"
                control={<Radio />}
                label="Mode Imputation"
              />
              <FormControlLabel
                value="removeRows"
                control={<Radio />}
                label="Remove rows with missing data"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log(csvData);
              processMissingData();
            }}
            color="primary"
            disabled={!missingDataOption}
          >
            Preview Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Changes Modal */}
      <PreviewChangesModal />
      {/* Remove Rows Preview Modal */}
      <RemoveRowsPreviewModal />
      {/* Removed Duplicates Modal */}
      <RemovedDuplicatesModal />
      {/* Validation Changes Modal */}
      <ValidationChangesModal />

      <SnackNotif
        message={snackMessage}
        severity={snackSeverity}
        open={snackOpen}
        setOpen={setSnackOpen}
      />
    </DataCleaningContext.Provider>
  );
};
