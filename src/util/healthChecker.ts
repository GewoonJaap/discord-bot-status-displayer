import axios from "axios";

export interface HealthCheckResult {
  isHealthy: boolean;
  error?: string;
}

export async function checkHealth(url: string, timeout: number = 5000): Promise<HealthCheckResult> {
  try {
    await axios.get(url, {
      timeout,
      validateStatus: (status) => status >= 200 && status < 300
    });
    return { isHealthy: true };
  } catch (error) {
    return {
      isHealthy: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
