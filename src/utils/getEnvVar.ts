// Purpose: Get an environment variable, throwing an error if it is not set.
export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    throw new Error(`${key} is not set`);
  }
  return value;
}
