import { SyntheticEvent, useState } from "react";
import { TextField } from "@mui/material";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useChartContext } from "@/lib/ChartContext";

interface RemarksProps {
  id: string;
}

export const Remarks: React.FC<RemarksProps> = ({ id }) => {
  const { removeFigure } = useChartContext();

  // For resizing
  const minDimensions = { width: 300, height: 120 };
  const [width, setWidth] = useState(minDimensions.width);
  const [height, setHeight] = useState(minDimensions.height);
  const onResize = (_e: SyntheticEvent, { size }: ResizeCallbackData) => {
    if (size) {
      setWidth(size.width);
      setHeight(size.height);
    }
  };
  return (
    <ResizableBox
      className="relative group"
      width={width}
      height={height}
      onResize={onResize}
      minConstraints={[minDimensions.width, minDimensions.height]}
    >
      <DeleteIcon
        className="absolute top-1 right-2 z-10 opacity-0 text-[#d32f2f] group-hover:opacity-100 cursor-pointer"
        onClick={() => removeFigure(id)}
      />
      <div className="relative max-h-full max-w-full overflow-scroll rounded-md">
        <TextField
          className="bg-white w-full h-full"
          placeholder="Type your remarks here..."
          minRows={Math.floor(height / 23)}
          multiline
        />
      </div>
    </ResizableBox>
  );
};
