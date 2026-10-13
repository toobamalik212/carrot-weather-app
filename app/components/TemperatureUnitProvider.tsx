"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type TemperatureUnit = "C" | "F";

interface TemperatureUnitContextValue {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
}

const STORAGE_KEY = "weather-temperature-unit";
const TemperatureUnitContext =
  createContext<TemperatureUnitContextValue | null>(null);

export function TemperatureUnitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUnit = window.localStorage.getItem(STORAGE_KEY);
    if (storedUnit === "C" || storedUnit === "F") {
      setUnit(storedUnit);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      window.localStorage.setItem(STORAGE_KEY, unit);
    }
  }, [isInitialized, unit]);

  return (
    <TemperatureUnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </TemperatureUnitContext.Provider>
  );
}

export function useTemperatureUnit() {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error(
      "useTemperatureUnit must be used within a TemperatureUnitProvider"
    );
  }
  return context;
}
