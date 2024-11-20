import React, { useState, useContext } from "react";
import { Modal, Box, Button, Checkbox, Select, MenuItem } from "@mui/material";
import { DataGrid, GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import { CsvContext } from "../../../lib/CsvContext";

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

interface StepModalProps {
  header: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setChoice: (choice: string) => void;
  mustBeNumber?: boolean;
  optional?: boolean;
}

const StepModal: React.FC<StepModalProps> = ({
  header,
  open,
  onClose,
  onConfirm,
  setChoice,
  mustBeNumber = false,
  optional = false,
}) => {
  const { csvData } = useContext(CsvContext);
  const [metric, setMetric] = useState("count");
  const columnSelection = Object.keys(csvData[0]).map((key, index) => {
    const [selected, setSelected] = useState(false);

    return {
      index: index,
      name: key,
      type: determineValueType(String(csvData[0][key])),
      selected: selected,
      setSelected: setSelected,
    };
  });

  const select = (index: number) => {
    // Deselect all columns except the selected one
    Object.keys(csvData[0])
      .filter((_, i) => i !== index)
      .map((_, i) => {
        columnSelection[i].setSelected(false);
      });
    // Toggle the selected column
    columnSelection[index].setSelected(!columnSelection[index].selected);
  };

  const columns: GridColDef[] = csvData.length
    ? Object.keys(csvData[0]).map((key, index) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 150,
        renderHeader: (params: GridColumnHeaderParams) => (
          <div
            onClick={() => select(index)}
            className="flex flex-row space-x-2 items-center"
          >
            <Checkbox
              checked={columnSelection[index].selected}
              onChange={() => {
                select(index);
              }}
            />

            {params.field}
          </div>
        ),
      }))
    : [];
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="flex flex-row w-full justify-center mb-4">
          <span className="text-2xl font-bold">{header}</span>
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
              columnSelection
                .filter((col) => col.selected)
                .map((col) => {
                  col.setSelected(false);
                  setChoice(col.name);
                });
              onConfirm();
            }}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
          <Button onClick={onClose} color="secondary" variant="contained">
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default StepModal;
