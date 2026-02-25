function formatCoordinate(value, decimals = 3) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return numericValue.toFixed(decimals);
}

export default function formatEventLocation(x, y, decimals = 3) {
  const formattedX = formatCoordinate(x, decimals);
  const formattedY = formatCoordinate(y, decimals);

  if (formattedX == null || formattedY == null) return "-";
  return `${formattedX}, ${formattedY}`;
}
