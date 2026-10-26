/** Environment variable access with validation. */

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  backendUrl: getEnvVar("NEXT_PUBLIC_BACKEND_URL", "http://localhost:8000"),
} as const;
