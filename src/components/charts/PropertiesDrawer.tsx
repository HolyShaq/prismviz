import { Button, Drawer, MenuItem, Select } from "@mui/material";
import { PropsWithChildren } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

interface PropertiesDrawerProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const PropertiesDrawer: React.FC<
  PropsWithChildren<PropertiesDrawerProps>
> = ({ children, open, setOpen }) => {
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="w-[250px] h-full p-4 bg-primary-pressed text-white">
        <div className="flex flex-row justify-end mt-[-10px] mr-[-10px]">
          <CloseIcon fontSize="medium" onClick={() => setOpen(false)} />
        </div>
        <span className="text-2xl font-bold">Properties</span>
        <div className="flex flex-col space-y-2 mt-2">{children}</div>
      </div>
    </Drawer>
  );
};

// Drawer Children Components
interface ColumnSelectionProps {
  label: string;
  axis: string;
  setAxis: (axis: string) => void;
  metric?: string;
  setMetric?: (metric: string) => void;
  items: string[];
  optional?: boolean;
}

export const ColumnSelection: React.FC<ColumnSelectionProps> = ({
  label,
  axis,
  setAxis,
  metric = null,
  setMetric = () => {},
  items,
  optional = false,
}) => {
  return axis ? (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row justify-between items-center">
        <span className="font-thin">{label}</span>
        {optional && (
          <DeleteIcon
            fontSize="small"
            onClick={() => {
              setAxis("");
              setMetric("");
            }}
          />
        )}
      </div>
      <Select
        className="bg-white"
        value={axis}
        onChange={(event) => setAxis(event.target.value as string)}
      >
        {items.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>

      {metric && (
        <Select
          className="bg-white"
          value={metric}
          onChange={(event) => setMetric(event.target.value as string)}
        >
          <MenuItem value="average">Average</MenuItem>
          <MenuItem value="sum">Sum</MenuItem>
          <MenuItem value="minimum">Minimum</MenuItem>
          <MenuItem value="maximum">Maximum</MenuItem>
          <MenuItem value="median">Median</MenuItem>
          <MenuItem value="mode">Mode</MenuItem>
          <MenuItem value="count">Count</MenuItem>
        </Select>
      )}
    </div>
  ) : (
    <Button
      variant="contained"
      onClick={() => {
        setAxis(items[0]);
        setMetric("average");
      }}
    >
      Add {label}
    </Button>
  );
};
