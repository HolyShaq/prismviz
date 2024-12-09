import { Box, Button, Modal, Slide } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useReactToPrint } from "react-to-print";
import { useChartContext } from "@/lib/ChartContext";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

interface GenerateReportModalProps {
  invoked: boolean;
  setInvoked: (open: boolean) => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  invoked,
  setInvoked,
}) => {
  const { chartsRef } = useChartContext();
  const reactToPrintFn = useReactToPrint({
    contentRef: chartsRef,
  });
  return (
    <Modal open={invoked} onClose={() => setInvoked(false)}>
      <Slide direction="up" in={invoked}>
        <div className="flex h-screen justify-center items-center">
          <Box
            className="w-fit p-4 py-4"
            sx={{
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex w-full">
                <span className="text-2xl font-bold">Print Report as</span>
              </div>

              <div className="flex flex-row space-x-4">
                <GenerateReportButton
                  label="Print as PDF"
                  onClick={() => {
                    reactToPrintFn();
                    setInvoked(false);
                  }}
                />
                <GenerateReportButton
                  label="Save as Image"
                  onClick={() => {
                    htmlToImage
                      .toPng(chartsRef.current!)
                      .then(function (dataUrl) {
                        download(dataUrl, "chart.png");
                      });
                    setInvoked(false);
                  }}
                />
              </div>

              <div className="flex w-full justify-end">
                <Button variant="contained" onClick={() => setInvoked(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </Slide>
    </Modal>
  );
};

interface GenerateReportButtonProps {
  label: string;
  onClick: () => void;
}
const GenerateReportButton: React.FC<GenerateReportButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <div
      className="flex items-center justify-center h-full rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div
        className="flex flex-col items-center justify-center rounded-lg shadow-lg"
        style={{
          background: "var(--primary-surface)",
          width: "150px",
          textAlign: "center",
          border: "3px solid #a0a0aa",
        }}
      >
        <UploadFileIcon
          className="m-4"
          sx={{
            fontSize: "var(--font-size-h1)",
            color: "var(--neutral-white-30)",
            marginBottom: "10px",
          }}
        />

        <div
          className="bg-[#d6d7d8]"
          style={{
            borderTop: "3px solid #a0a0aa",
            width: "100%",
            marginTop: "10px",
            paddingTop: "10px",
            fontSize: "var(--font-size-p2)",
          }}
        >
          <div className="p-4">
            <span className="font-bold">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
