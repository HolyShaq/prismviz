import React, { createContext, useContext, ReactNode, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

export const DataCleaningContext = createContext<DataCleaningContextType>({
    handleMissingData: () => { },
    removeDuplicates: () => { },
    validateColumns: () => { },
});

export const DataCleaningProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { csvData, setCsvData } = useContext(CsvContext);

    const [openModal, setOpenModal] = useState(false);
    const [openPreviewModal, setOpenPreviewModal] = useState(false); // State for preview modal
    const [missingDataOption, setMissingDataOption] = useState<string>("");
    const [removeEmptyRows, setRemoveEmptyRows] = useState(false);
    const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]); // For holding the preview data
    const [openRemovePreviewModal, setOpenRemovePreviewModal] = useState(false); // Modal for row removal preview
    const [rowsWithMissingData, setRowsWithMissingData] = useState<any[]>([]); // Rows with missing data to be removed

    // Function to identify rows with missing data
    const findRowsWithMissingData = () => {
        const rowsToRemove = csvData.filter((row) => Object.values(row).some((value) => value === null));
        setRowsWithMissingData(rowsToRemove);
    };

    // Function to remove rows with missing data
    const removeRowsWithMissingData = () => {
        const filteredData = csvData.filter((row) => !Object.values(row).some((value) => value === null));
        setCsvData(filteredData);
        setRowsWithMissingData([]); // Clear the rows with missing data after removal
        setOpenRemovePreviewModal(false); // Close remove preview modal
        setOpenModal(false); // Close the orginal preview modal
    };

    // Show the modal for rows with missing data before removal
    const handleRemoveRowsWithMissingData = () => {
        findRowsWithMissingData();
        setOpenRemovePreviewModal(true); // Open the new modal to confirm row removal
    };

    // New Modal specifically for previewing the rows to be removed
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
                    <Button onClick={removeRowsWithMissingData} color="primary">
                        Confirm Removal
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const linearInterpolation = () => {

        const processedData = csvData.map((row, rowIndex) => {
            Object.keys(row).forEach((column) => {
                const columnData = row[column];

                if (columnData === null) {
                    let prevIndex = -1;
                    let nextIndex = -1;

                    // Find previous non-null index
                    for (let i = rowIndex - 1; i >= 0; i--) {
                        if (csvData[i][column] !== null) {
                            prevIndex = i;
                            break;
                        }
                    }

                    // Find next non-null index
                    for (let i = rowIndex + 1; i < csvData.length; i++) {
                        if (csvData[i][column] !== null) {
                            nextIndex = i;
                            break;
                        }
                    }

                    // If both previous and next values are found, perform interpolation
                    if (prevIndex !== -1 && nextIndex !== -1) {
                        const prevX = Number(csvData[prevIndex].x); 
                        const nextX = Number(csvData[nextIndex].x); 
                        const prevY = Number(csvData[prevIndex][column]); 
                        const nextY = Number(csvData[nextIndex][column]); 

                        // Debugging log to see interpolation values
                        console.log("Interpolating for row:", rowIndex);
                        console.log("prevX:", prevX, "nextX:", nextX, "prevY:", prevY, "nextY:", nextY);
                        console.log("row.x:", row.x);

                        if (nextX === prevX) {
                            row[column] = prevY; // Handle case where x values are equal
                        } else {
                            row[column] = prevY + ((nextY - prevY) / (nextX - prevX)) * (Number(row.x) - prevX);
                        }
                    }
                }
            });

            return row;
        });

        setCsvData(processedData);
        setPreviewData(processedData);
        setOpenPreviewModal(true);
        setOpenModal(false);
    };

    // Mode Imputation (replaces nulls with the most frequent value)
    const applyModeImputation = () => {
        let processedData: Record<string, unknown>[] = [...csvData];

        // Iterate through each row of the data
        processedData = processedData.map((row) => {
            const columns = Object.keys(row);
            const newRow: Record<string, unknown> = { ...row }; // Create a copy of the row to avoid mutating original data

            columns.forEach((column) => {
                const columnData = csvData.map((r) => r[column]); // Extract all the values for this column

                // Filter out nulls and create a frequency map for the column values
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
                if (modeValue !== undefined) {
                    if (typeof modeValue === "string" || typeof modeValue === "number") {
                        newRow[column] = modeValue; // Impute the missing data with the mode
                    }
                }
            });

            return newRow;
        });

        // Set the preview data to show the difference
        setPreviewData(processedData);
        setOpenPreviewModal(true); // Open preview modal
        setOpenModal(false); // Close the original modal
    };

    // Mean Imputation (replaces nulls with the mean of the column)
    const applyMeanImputation = () => {
        let processedData: Record<string, unknown>[] = [...csvData];

        // Iterate through each row of the data
        processedData = processedData.map((row) => {
            const columns = Object.keys(row);
            const newRow: Record<string, unknown> = { ...row }; // Create a copy of the row to avoid mutating the original data

            columns.forEach((column) => {
                const columnData = csvData.map((r) => r[column]); // Extract all the values for this column

                // Filter out nulls to get only valid data
                const nonNullColumnData = columnData.filter((value) => value !== null);

                // Calculate the mean for the column (if there are valid non-null values)
                if (nonNullColumnData.length > 0) {
                    // Initialize accumulator as a number (0 is the default starting value)
                    const sum = nonNullColumnData.reduce((acc: number, value) => acc + (Number(value) || 0), 0);

                    const meanValue = sum / nonNullColumnData.length;

                    // Replace nulls with the mean value
                    if (newRow[column] === null) {
                        newRow[column] = meanValue; // Impute the missing data with the mean
                    }
                }
            });

            return newRow;
        });

        // Set the processed data as preview data to show the difference
        setPreviewData(processedData);
        setOpenPreviewModal(true); // Open preview modal
        setOpenModal(false); // Close the original modal
    };



    // Preview Modal for showing the changes
    const PreviewChangesModal = () => {
        // Ensure csvData is not empty or undefined before attempting to use it 
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

        // Prepare columns for DataGrid with dynamic headers based on column names
        const columns: GridColDef[] = Object.keys(csvData[0]).map((column) => ({
            field: column,
            headerName: column,
            width: 200,
            renderCell: (params) => {
                const originalValue = csvData[params.row.id][params.field];
                const updatedValue = params.value;

                // Ensure values are strings to avoid the 'unknown' error
                const originalStr = String(originalValue);
                const updatedStr = String(updatedValue);

                // If the value has changed, we show strikethrough for original and green for updated
                const isUpdated = originalStr !== updatedStr;

                return (
                    <Box>
                        {isUpdated ? (
                            <>
                                <Typography variant="body2" style={{ color: 'red', textDecoration: 'line-through' }}>
                                    {originalStr}
                                </Typography>
                                <Typography variant="body2" style={{ color: 'green' }}>
                                    {updatedStr}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2">{originalStr}</Typography>
                        )}
                    </Box>
                );
            }
        }));

        // Prepare rows based on the previewData
        const rows = previewData.map((row, rowIndex) => ({
            id: rowIndex, // The row index serves as the unique ID
            ...row // The rest of the row is spread from previewData
        }));

        return (
            <Dialog open={openPreviewModal} onClose={() => setOpenPreviewModal(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Preview Changes</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Preview of Changes:</Typography>
                    <Box sx={{ marginTop: 2, height: 400 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 100,
                                    },
                                },
                            }} // Adjust number of rows per page
                            pageSizeOptions={[100]} // You can customize how many rows per page
                            disableRowSelectionOnClick // Disables row selection to keep it clean
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPreviewModal(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={() => applyChanges()} color="primary">
                        Apply Changes
                    </Button>
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
            case "linearInterpolation":
                linearInterpolation();
                break;
            case "modeImputation":
                applyModeImputation(); // Apply mode imputation
                break;
            case "meanImputation":
                applyMeanImputation(); // Apply mean imputation
                break;
            case "removeRows":
                handleRemoveRowsWithMissingData();
            default:
                break;
        }
    };

    const removeDuplicates = () => {
        const uniqueData = _.uniqWith(csvData, _.isEqual);
        setCsvData(uniqueData); // Update csvData in CsvContext
    };

    const validateColumns = () => {
        const validatedData = csvData.map((row) =>
            _.mapValues(row, (value) =>
                typeof value === "string" && !isNaN(parseFloat(value)) ? parseFloat(value) : value
            )
        );
        setCsvData(validatedData); // Update csvData in CsvContext
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
                        <RadioGroup value={missingDataOption} onChange={(e) => setMissingDataOption(e.target.value)}>
                            <FormControlLabel value="linearInterpolation" control={<Radio />} label="Linear Interpolation" />
                            <FormControlLabel value="modeImputation" control={<Radio />} label="Mode Imputation" />
                            <FormControlLabel value="meanImputation" control={<Radio />} label="Mean Imputation" />
                            <FormControlLabel value="removeRows" control={<Radio />} label="Remove rows with missing data" />
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
        </DataCleaningContext.Provider>
    );
};
