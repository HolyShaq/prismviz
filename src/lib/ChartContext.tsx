"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ChartContextType = {
  chartsRef: React.RefObject<HTMLDivElement>;
  figures: { [key: string]: ReactNode };
  addFigure: (id: string, figure: ReactNode) => void;
  removeFigure: (id: string) => void;
  clearFigures: () => void;
  xAxis: string;
  setXAxis: (x: string) => void;
  yAxis: string;
  setYAxis: (y: string) => void;
  yMetric: string;
  setYMetric: (metric: string) => void;
};

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined
);

export const ChartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chartsRef = React.useRef<HTMLDivElement>(null);
  const [figures, setFigures] = useState<{ [key: string]: ReactNode }>({});
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [yMetric, setYMetric] = useState("");

  const addFigure = (id: string, figure: ReactNode) => {
    setFigures((prevFigures) => ({
      ...prevFigures,
      [id]: figure,
    }));
  };

  const removeFigure = (idToRemove: string) => {
    setFigures((prevFigures) => {
      const newFigures = { ...prevFigures };
      delete newFigures[idToRemove];
      return newFigures;
    });
  };

  const clearFigures = () => setFigures({});

  return (
    <ChartContext.Provider
      value={{
        chartsRef,
        figures,
        addFigure,
        removeFigure,
        clearFigures,
        xAxis,
        setXAxis,
        yAxis,
        setYAxis,
        yMetric,
        setYMetric,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error(
      "useChartContext must be used within a ChartContextProvider"
    );
  }
  return context;
};
 