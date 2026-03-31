import { useState } from "react";
import {
  calculateBMI,
  calculateMaintenanceCalories
} from "../utils/calculateHealth";

export function useHealthAnalysis(profile) {
  const [healthAnalysis, setHealthAnalysis] = useState(null);
  const [healthError, setHealthError] = useState(null);

  const calculateHealth = () => {
    const bmiResult = calculateBMI(profile.weight, profile.height);

    // Validation error
    if (bmiResult?.error) {
      setHealthError(bmiResult.error);
      setHealthAnalysis(null);
      return;
    }

    setHealthError(null);

    setHealthAnalysis({
      bmi: bmiResult,
      maintenance: calculateMaintenanceCalories(profile)
    });
  };

  return {
    healthAnalysis,
    healthError,
    calculateHealth
  };
}