export function calculateBMI(
  heightCm: number | null | undefined,
  weightKg: number | null | undefined
): string | null {
  if (heightCm && weightKg) {
    return (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);
  }

  return null;
}
