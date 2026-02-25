function toFiniteNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return null;
  return value.toFixed(3).replace(/\.?0+$/, "");
}

export function getThresholdExceedance(value, threshold) {
  const numericValue = toFiniteNumber(value);
  const numericThreshold = toFiniteNumber(threshold);

  if (numericValue == null || numericThreshold == null) return null;
  if (numericValue <= numericThreshold) return null;

  return numericValue - numericThreshold;
}

export function getThresholdExceedanceText(value, threshold, unit = "") {
  const exceedance = getThresholdExceedance(value, threshold);
  if (exceedance == null) return null;

  const formatted = formatNumber(exceedance);
  if (formatted == null) return null;

  return unit ? `${formatted} ${unit}` : formatted;
}
