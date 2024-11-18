"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ChartContextType = {
  figures: ReactNode[];
  addFigure: (figure: ReactNode) => void;
  removeFigure: (index: number) => void;
};

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined,
);

export const ChartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [figures, setFigures] = useState<ReactNode[]>([]);

  const addFigure = (figure: ReactNode) => {
    setFigures((prevFigures) => [...prevFigures, figure]);
  };

  const removeFigure = (index: number) => {
    setFigures((prevFigures) => prevFigures.filter((_, i) => i !== index));
  };

  return (
    <ChartContext.Provider value={{ figures, addFigure, removeFigure }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error(
      "useChartContext must be used within a ChartContextProvider",
    );
  }
  return context;
};
