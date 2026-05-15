export const validateEnv = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing required environment variable: VITE_API_BASE_URL.");
  }

  try {
    new URL(baseUrl);
  } catch {
    throw new Error(`Invalid VITE_API_BASE_URL: ${baseUrl}`);
  }

  return baseUrl;
};
