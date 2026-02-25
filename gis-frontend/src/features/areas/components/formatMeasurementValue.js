export default function formatMeasurementValue(value, unit) {
  if (value == null) return "-";
  return unit ? `${value} ${unit}` : String(value);
}
