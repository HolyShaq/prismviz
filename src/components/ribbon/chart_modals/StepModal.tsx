import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Checkbox,
  Select,
  MenuItem,
  Popover,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { DataGrid, GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import { CsvContext } from "../../../lib/CsvContext";

// Helper function to determine the data type of a string
function determineValueType(str: string) {
  // Check if the string is a numerical value
  const num = parseFloat(str);
  if (!isNaN(num)) {
    if (num >= 1000 && num <= 9999) {
      // assume it's a year if it's a 4-digit number
      return "date";
    } else {
      return "number";
    }
  }

  // Check if the string is a date value
  const date = new Date(str);
  if (!isNaN(date.getTime())) {
    return "date";
  }

  // If none of the above, assume it's a word value
  return "string";
}

// Popover for selecting metric for string columns
interface PopoverMetric {
  anchorEl: Element | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  metric: string;
  setMetric: (metric: string) => void;
}

const PopoverMetric: React.FC<PopoverMetric> = ({
  anchorEl,
  open,
  setOpen,
  metric,
  setMetric,
}) => {
  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Select
        value={metric}
        label="Metric"
        onChange={(event) => {
          setMetric(event.target.value as string);
        }}
      >
        <MenuItem value="average">Average</MenuItem>
        <MenuItem value="sum">Sum</MenuItem>
        <MenuItem value="count">Count</MenuItem>
        <MenuItem value="minimum">Minimum</MenuItem>
        <MenuItem value="maximum">Maximum</MenuItem>
        <MenuItem value="median">Median</MenuItem>
        <MenuItem value="mode">Mode</MenuItem>
      </Select>
    </Popover>
  );
};

interface StepModalProps {
  header: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setChoice: (choice: string) => void;
  setChoiceMetric?: (choiceMetric: string) => void;
  categorical?: boolean;
  optional?: boolean;
}

const StepModal: React.FC<StepModalProps> = ({
  header,
  open,
  onClose,
  onConfirm,
  setChoice,
  setChoiceMetric = () => {},
  categorical = false,
  optional = false,
}) => {
  const { csvData } = useContext(CsvContext);
  const columnSelection = Object.keys(csvData[0]).map((key, index) => {
    const type = determineValueType(String(csvData[0][key]));
    return {
      index: index,
      name: key,
      type: type,
    };
  });

  // Column States
  const [selectedColumns, setSelectedColumns] = useState(
    columnSelection.map(() => false),
  );
  const [openColumns, setOpenColumns] = useState(
    columnSelection.map(() => false),
  );
  const [metricColumns, setMetricColumns] = useState<string[]>(
    columnSelection.map((column) =>
      column.type === "number" ? "average" : "",
    ),
  );
  const checkRefColumns = useRef(new Map());

  function getMap() {
    if (!checkRefColumns.current) {
      checkRefColumns.current = new Map();
    }
    return checkRefColumns.current;
  }

  // Use alongside with column states to easily set states
  const setBool = (
    method: React.Dispatch<React.SetStateAction<boolean[]>>,
    index: number,
    value: boolean,
  ) => {
    method((prevState) => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };
  const setString = (
    method: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    method((prevState) => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  // Update selected choice and metric
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) {
      const selectedIndex = selectedColumns.indexOf(true);
      if (selectedIndex !== -1) {
        setChoice(columnSelection[selectedIndex].name);
        setChoiceMetric(metricColumns[selectedIndex]);
      }
      onConfirm();
      setDone(false);
    }
  }, [done]);

  const select = (index: number) => {
    // Deselect all columns except the selected one
    Object.keys(csvData[0])
      .filter((_, i) => i !== index)
      .map((_, i) => {
        setBool(setSelectedColumns, i, false);
      });
    // Toggle the selected column
    setBool(setSelectedColumns, index, !selectedColumns[index]);
  };

  const columns: GridColDef[] = csvData.length
    ? Object.keys(csvData[0]).map((key, index) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 150,
        renderHeader: (params: GridColumnHeaderParams) => (
          <div className="flex flex-row space-x-2 items-center">
            {(categorical || columnSelection[index].type === "number") && (
              <Checkbox
                ref={(node) => {
                  getMap().set(index, node);
                }}
                checked={selectedColumns[index]}
                onChange={() => {
                  select(index);
                  if (!categorical && !selectedColumns[index]) {
                    setBool(setOpenColumns, index, true);
                  }
                }}
              />
            )}

            {params.field}
          </div>
        ),
      }))
    : [];
  return (
    <Modal open={open} onClose={onClose}>
      <Slide direction="up" in={open}>
        <div className="flex h-screen justify-center items-center">
          <Box
            sx={{
              width: "80%",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="flex flex-row w-full justify-center mb-4">
              <span className="text-2xl font-bold">
                {header}
                {optional ? " (Optional)" : ""}
              </span>
            </div>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={csvData.map((row, index) => ({
                  id: index,
                  ...row,
                }))}
                columns={columns}
                disableColumnMenu={true}
                disableColumnSorting={true}
              />
            </Box>
            <div className="flex flex-row space-x-4 justify-end mt-4">
              <Button
                onClick={() => {
                  setDone(true);
                }}
                disabled={
                  optional
                    ? false
                    : !columnSelection.some(
                        (_col, index) => selectedColumns[index],
                      )
                }
                color="primary"
                variant="contained"
              >
                Confirm
              </Button>
              <Button onClick={onClose} color="secondary" variant="contained">
                Cancel
              </Button>
            </div>

            {columnSelection.map((_col, index) => {
              return (
                <PopoverMetric
                  key={index}
                  anchorEl={getMap().get(index)}
                  open={openColumns[index]}
                  setOpen={(open) => setBool(setOpenColumns, index, open)}
                  metric={metricColumns[index]}
                  setMetric={(metric) =>
                    setString(setMetricColumns, index, metric)
                  }
                />
              );
            })}
          </Box>
        </div>
      </Slide>
    </Modal>
  );
};

export default StepModal;
