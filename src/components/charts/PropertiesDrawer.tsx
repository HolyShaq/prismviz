import {
  Input,
  Button,
  Drawer,
  MenuItem,
  Select,
  Checkbox,
  Slider,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { PropsWithChildren } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useChartContext } from "@/lib/ChartContext";

interface PropertiesDrawerProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

export const PropertiesDrawer: React.FC<
  PropsWithChildren<PropertiesDrawerProps>
> = ({ children, open, setOpen, id }) => {
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col w-[250px] h-full p-4 bg-primary-pressed text-white">
        <div className="flex flex-row justify-end mt-[-10px] mr-[-10px]">
          <CloseIcon fontSize="medium" onClick={() => setOpen(false)} />
        </div>
        <span className="text-2xl font-bold">Properties</span>
        <div className="flex flex-col justify-between flex-grow">
          <div className="justify-start space-y-4 mt-2">{children}</div>
          <ChartDeletion id={id} />
        </div>
      </div>
    </Drawer>
  );
};

// Drawer Children Components

// Column Selection
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
        className="bg-white rounded-md"
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
          className="bg-white rounded-md"
          value={metric}
          onChange={(event) => setMetric(event.target.value as string)}
        >
          <MenuItem value="average">Average</MenuItem>
          <MenuItem value="sum">Sum</MenuItem>
          <MenuItem value="count">Count</MenuItem>
          <MenuItem value="minimum">Minimum</MenuItem>
          <MenuItem value="maximum">Maximum</MenuItem>
          <MenuItem value="median">Median</MenuItem>
          <MenuItem value="mode">Mode</MenuItem>
        </Select>
      )}
    </div>
  ) : (
    <Button
      className="w-full"
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

// Title Selection
interface TitleSelectionProps {
  title: string;
  setTitle: (title: string) => void;
}
export const TitleSelection: React.FC<TitleSelectionProps> = ({
  title,
  setTitle,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <span className="font-thin">Title</span>
      <Input
        className="bg-white h-14 px-2 py-1 rounded-md"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Type something"
      />
    </div>
  );
};

// Color Selection
interface ColorSelectionProps {
  color: string;
  setColor: (color: string) => void;
}
export const ColorSelection: React.FC<ColorSelectionProps> = ({
  color,
  setColor,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <span className="font-thin">Color</span>
      <MuiColorInput
        className="bg-white h-14 rounded-md"
        value={color}
        onChange={setColor}
      />
    </div>
  );
};

// Legend Selection
interface LegendOptionProps {
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  legendPosition: string;
  setLegendPosition: (legend: string) => void;
}
export const LegendOption: React.FC<LegendOptionProps> = ({
  showLegend,
  setShowLegend,
  legendPosition: legend,
  setLegendPosition: setLegend,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row space-x-1 items-center">
        <span className={"font-thin " + (showLegend ? "" : "opacity-50")}>
          Legend
        </span>
        <Checkbox
          checked={showLegend}
          onChange={() => setShowLegend(!showLegend)}
        />
      </div>
      {showLegend && (
        <Select
          className="bg-white rounded-md"
          value={legend}
          onChange={(event) => setLegend(event.target.value as string)}
        >
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </Select>
      )}
    </div>
  );
};

// Circumference Slider
interface CircumferenceSliderProps {
  circumference: number;
  setCircumference: (circumference: number) => void;
}

export const CircumferenceSlider: React.FC<CircumferenceSliderProps> = ({
  circumference,
  setCircumference,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <span className="font-thin">Circumference</span>
      <div className="px-4">
        <Slider
          sx={{
            "& .MuiSlider-markLabel": {
              color: "white",
            },
          }}
          value={circumference}
          onChange={(_event, value) => setCircumference(value as number)}
          valueLabelDisplay="auto"
          min={90}
          max={360}
          step={10}
          marks={[
            {
              value: 90,
              label: "90°",
            },
            {
              value: 180,
              label: "180°",
            },
            {
              value: 270,
              label: "270°",
            },
            {
              value: 360,
              label: "360°",
            },
          ]}
        />
      </div>
    </div>
  );
};

// Chart Deletion
export const ChartDeletion: React.FC<{ id: string }> = (id) => {
  const { removeFigure } = useChartContext();
  return (
    <div className="justify-self-end">
      <Button
        className="w-full"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => removeFigure(id.id)}
      >
        Delete Chart
      </Button>
    </div>
  );
};
