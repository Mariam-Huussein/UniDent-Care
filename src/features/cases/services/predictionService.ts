import api from "@/utils/api";

interface PredictionResult {
  success: boolean;
  prediction?: string;
  label?: string;
  confidence?: number;
  all_predictions?: Array<{
    label: string;
    name: string;
    confidence: number;
  }>;
  error?: string;
}

export const predictCaseType = async (
  text: string,
  language: string = "en"
): Promise<PredictionResult> => {
  try {
    const response = await fetch("/api/predict-case-type", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Prediction failed",
      };
    }

    const result: PredictionResult = await response.json();
    return result;
  } catch (error: any) {
    console.error("Prediction service error:", error);
    return {
      success: false,
      error: error.message || "Failed to predict case type",
    };
  }
};
