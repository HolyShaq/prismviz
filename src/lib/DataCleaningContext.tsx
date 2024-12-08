import React, { createContext, useContext, ReactNode, useState } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import _ from "lodash";
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
} from "@mui/material";

// Type for the methods in our DataCleaningContext
type DataCleaningContextType = {
    handleMissingData: () => void;
    removeDuplicates: () => void;
    validateColumns: () => void;
};
type RowData = Record<string, unknown>;

export const DataCleaningContext = createContext<DataCleaningContextType>({
    handleMissingData: () => { },
    removeDuplicates: () => { },
    validateColumns: () => { },
});

export const DataCleaningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { csvData, setCsvData } = useContext(CsvContext);

    const [openModal, setOpenModal] = useState(false);
    const [openPreviewModal, setOpenPreviewModal] = useState(false); // State for preview modal
    const [missingDataOption, setMissingDataOption] = useState<string>("");
    const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]); // For holding the preview data
    const [openRemovePreviewModal, setOpenRemovePreviewModal] = useState(false); // Modal for row removal preview
    const [rowsWithMissingData, setRowsWithMissingData] = useState<Record<string, unknown>[]>([]);

    const [removedDuplicates, setRemovedDuplicates] = useState<Record<string, unknown>[]>([]);
    const [openRemovedDuplicatesModal, setOpenRemovedDuplicatesModal] = useState(false);

    const [validatedChanges, setValidatedChanges] = useState<RowData[]>([]);
    const [openValidationModal, setOpenValidationModal] = useState<boolean>(false);


    /* Step 1 functions for handling missing data */

    const findRowsWithMissingData = () => {
        const rowsToRemove = csvData.filter((row) => {
            // Count the number of missing (null) values in the row
            const missingCount = Object.values(row).filter((value) => value === null).length;
            return missingCount > 2; // Flag rows with more than 2 missing values
        });

        setRowsWithMissingData(rowsToRemove);
    };

    const removeRowsWithMissingData = () => {
        const filteredData = csvData.filter((row) => {
            // Count the number of missing (null) values in the row
            const missingCount = Object.values(row).filter((value) => value === null).length;
            return missingCount <= 2; // Keep rows with 2 or fewer missing values
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
            <Dialog open={openRemovePreviewModal} onClose={() => setOpenRemovePreviewModal(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Rows to be Removed</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">The following rows contain missing data:</Typography>
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
                                        columns={Object.keys(rowsWithMissingData[0] || {}).map((column) => ({
                                            field: column,
                                            headerName: column,
                                            width: 200,
                                        }))}
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
                    <Button onClick={() => setOpenRemovePreviewModal(false)} color="primary">
                        Cancel
                    </Button>
                    {/* Show the "Confirm Removal" button only if there are rows to remove */}
                    {rowsWithMissingData.length > 0 && (
                        <Button onClick={removeRowsWithMissingData} color="primary">
                            Confirm Removal
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        );
    };

    // Mode Imputation (replaces nulls with the most frequent value)
    const applyModeImputation = () => {
        let processedData: Record<string, unknown>[] = [...csvData];

        // Iterate through each row of the data
        processedData = processedData.map((row) => {
            const columns = Object.keys(row);
            const newRow: Record<string, unknown> = { ...row }; // Create copy of the row to avoid mutating original data

            columns.forEach((column) => {
                const columnData = csvData.map((r) => r[column]); // Extract all the values for this column
                const nonNullColumnData = columnData.filter((value) => value !== null);

                // Create a frequency map (a plain object where keys are values, and values are frequencies)
                const frequencyMap: Record<string, number> = {};
                nonNullColumnData.forEach((value) => {
                    const key = String(value); // Convert value to string as keys are always strings
                    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
                });

                // Find the mode (the value with the highest frequency)
                let modeValue: string | number | undefined = undefined;
                let maxCount = 0;
                for (const key in frequencyMap) {
                    const count = frequencyMap[key];
                    if (count > maxCount) {
                        maxCount = count;
                        modeValue = key; // Set modeValue to the most frequent value
                    }
                }

                // If we found a mode value, replace the missing value (null) with the mode
                if (modeValue !== undefined && newRow[column] === null) {
                    newRow[column] = modeValue; // Impute the missing data with the mode
                }
            });

            return newRow;
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
                <Dialog open={openPreviewModal} onClose={() => setOpenPreviewModal(false)} maxWidth="lg" fullWidth>
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
                const originalValue = csvData[params.row.id][params.field];  // Original value
                const updatedValue = params.value;  // Updated value

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
                                <Typography variant="body2" style={{ color: 'red', textDecoration: 'line-through' }}>
                                    {originalStr}
                                </Typography>
                                {/* Show updated value in green */}
                                <Typography variant="body2" style={{ color: 'green' }}>
                                    {updatedStr}
                                </Typography>
                            </>
                        ) : (
                            // If no change, just display the original value in black text
                            <Typography variant="body2">{originalStr}</Typography>
                        )}
                    </Box>
                );
            }
        }));

        return (
            <Dialog open={openPreviewModal} onClose={() => setOpenPreviewModal(false)} maxWidth="lg" fullWidth>
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
                        <Button onClick={() => applyChanges()} color="primary">
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
        const seen = new Map<string, RowData>();  // Use Map to track unique rows
        const duplicates: RowData[] = [];  // Explicitly define the type of 'duplicates'

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
                <Dialog open={openRemovedDuplicatesModal} onClose={() => setOpenRemovedDuplicatesModal(false)} maxWidth="lg" fullWidth>
                    <DialogTitle>Removed Duplicates</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">No duplicates found to display.</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenRemovedDuplicatesModal(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        // Add a unique id to each row for DataGrid
        const rowsWithIds = removedDuplicates.map((row, index) => ({
            ...row,  // Copy the row's data
            id: index // Add a unique 'id' based on the index (or use another strategy like serialized row data)
        }));

        return (
            <Dialog open={openRemovedDuplicatesModal} onClose={() => setOpenRemovedDuplicatesModal(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Removed Duplicates</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">The following rows are duplicates:</Typography>
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
                    <Button onClick={() => setOpenRemovedDuplicatesModal(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={applyRemovedDuplicates} color="primary">
                        Apply Changes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    // Function to apply removed duplicates
    const applyRemovedDuplicates = () => {
        // Remove duplicates by creating a new array with unique rows
        const uniqueData = Array.from(new Map(csvData.map((row) => [JSON.stringify(row), row])).values());
        setCsvData(uniqueData);  // Update csvData
        setOpenRemovedDuplicatesModal(false);  // Close modal after applying
    };

    /* Step 3 functions for validating columns */

    // Function to validate columns and track changes
    const validateColumns = () => {
        const changes: RowData[] = [];// Array to store changes for tracking

        // Step 1: Validate and normalize data
        const validatedData = csvData.map((row, index) => {
            const validatedRow = _.mapValues(row, (value) => {
                // Check if the value is a string number and needs to be converted
                if (typeof value === 'string' && !isNaN(parseFloat(value))) {
                    // If it's a string that represents a number, convert it
                    const originalValue = value;
                    const convertedValue = parseFloat(value);
                    changes.push({
                        id: `change-${index}-${Object.keys(row).find((key) => row[key] === originalValue)}`, // Unique ID for each change
                        rowIndex: index,
                        column: Object.keys(row).find((key) => row[key] === originalValue),
                        originalValue,
                        convertedValue,
                    });
                    return convertedValue;
                }
                return value;
            });

            // Add a unique 'id' for each row
            return { ...validatedRow, id: index };
        });

        // Step 2: Update state with validated data and changes
        setCsvData(validatedData);
        setValidatedChanges(changes); // Store the changes
        setOpenValidationModal(true); // Open the modal to show the changes
    };

    // Modal to show what was changed during validation
    const ValidationChangesModal = () => {
        if (validatedChanges.length === 0) {
            return (
                <Dialog open={openValidationModal} onClose={() => setOpenValidationModal(false)} maxWidth="lg" fullWidth>
                    <DialogTitle>Validation Changes</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">No changes were made during validation.</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenValidationModal(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        // Prepare columns dynamically based on the column names of the data
        const columns: GridColDef[] = Object.keys(validatedChanges[0]).map((column) => ({
            field: column,
            headerName: column,  // Display the actual column name in the header
            width: 200,
            renderCell: (params: GridCellParams) => {
                const originalValue = params.row.originalValue;
                const convertedValue = params.row.convertedValue;

                const isUpdated = originalValue !== convertedValue;

                return (
                    <Box>
                        {isUpdated ? (
                            <>
                                {/* Show original value with red strikethrough */}
                                <Typography variant="body2" style={{ color: 'red', textDecoration: 'line-through' }}>
                                    {String(originalValue)}
                                </Typography>
                                {/* Show updated value in green */}
                                <Typography variant="body2" style={{ color: 'green' }}>
                                    {String(convertedValue)}
                                </Typography>
                            </>
                        ) : (
                            // If no change, just display the original value in black text
                            <Typography variant="body2">{String(originalValue)}</Typography>
                        )}
                    </Box>
                );
            },
        }));

        return (
            <Dialog open={openValidationModal} onClose={() => setOpenValidationModal(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Validation Changes</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">The following changes were made during validation:</Typography>
                    <Box sx={{ marginTop: 2, height: 400 }}>
                        <DataGrid
                            rows={validatedChanges} // Display changes in the modal
                            columns={columns} // Dynamically generated columns based on actual data columns
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
                    <Button onClick={() => setOpenValidationModal(false)} color="primary">
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
                    <Button onClick={processMissingData} color="primary" disabled={!missingDataOption}>
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
        </DataCleaningContext.Provider>
    );
};
