export function reportDevelopmentError(message: string): void {
  if (import.meta.env.DEV) {
    throw new Error(message);
  }

  console.error(message);
}
