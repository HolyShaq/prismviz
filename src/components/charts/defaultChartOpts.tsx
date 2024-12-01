import { capitalize } from "@/lib/utils";

const defaultChartOptions = (
  xAxis: string,
  yAxis: string = "",
  yMetricAxis: string,
) => {
  return {
    responsive: true,
    animation: {
      duration: 500, // Make transitions snappier
      colors: false,
    },
    plugins: {
      legend: {
        display: false,
        position: "top" as "top" | "right" | "bottom" | "left",
      },
      title: {
        display: true,
        text:
          (yAxis ? capitalize(yMetricAxis) + " " + yAxis + " per " : "") +
          xAxis,
      },
      tooltip: {
        callbacks: {},
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxis,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxis,
        },
      },
    } as
      | {
          x: { title: { display: boolean; text: string } };
          y: { title: { display: boolean; text: string } };
        }
      | undefined,
    indexAxis: "x" as "x" | "y",
  };
};

export default defaultChartOptions;
