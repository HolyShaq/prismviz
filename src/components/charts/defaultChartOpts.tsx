import { capitalize } from "@/lib/utils";

const defaultChartOptions = (
  xAxis: string,
  yAxis: string,
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
      },
      title: {
        display: true,
        text:
          (yAxis ? capitalize(yMetricAxis) + " " + yAxis + " per " : "") +
          xAxis,
      },
    },
  };
};

export default defaultChartOptions;
