import { useChartContext } from "@/lib/ChartContext";
import { Box, Button, Modal, Slide } from "@mui/material";
import * as htmlToImage from "html-to-image";
import { useEffect, useState } from "react";

interface ReportPreviewModalProps {
  invoked: boolean;
  setInvoked: (open: boolean) => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  invoked,
  setInvoked,
}) => {
  const { chartsRef } = useChartContext();
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  useEffect(() => {
    htmlToImage.toPng(chartsRef.current!).then(async function (dataUrl) {
      setPreviewImage(dataUrl);
    });
  }, [invoked]);

  return (
    <Modal open={invoked} onClose={() => setInvoked(false)}>
      <Slide direction="up" in={invoked}>
        <div className="flex h-screen justify-center items-center">
          <Box
            className="w-full h-fit max-h-full m-1 md:w-1/2 md:h-fit"
            sx={{
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="flex flex-col items-center space-y-4 max-h-[45vh]">
              <div className="flex w-full h-full">
                <span className="text-2xl font-bold">Preview of Report</span>
              </div>
              <div className="max-h-full overflow-y-scroll w-full">
                {chartsRef.current &&
                chartsRef.current.childElementCount > 0 ? (
                  <img src={previewImage} className="w-full h-full" />
                ) : (
                  <span>No charts added yet!</span>
                )}
              </div>
              <div className="flex flex-row w-full justify-end">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setInvoked(false)}
                >
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
